package handlers

import (
	"context"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"

	"github.com/Jaeger2305/du-meine-gute/authmiddleware"
	gameRepository "github.com/Jaeger2305/du-meine-gute/repository"
	"github.com/Jaeger2305/du-meine-gute/responses"
	"github.com/Jaeger2305/du-meine-gute/storage"
	models "github.com/Jaeger2305/du-meine-gute/storage/models"
	"github.com/go-chi/chi"
	"github.com/gorilla/websocket"
	"github.com/segmentio/kafka-go"
	"github.com/spf13/viper"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// We can marshal to a known type after initially marshalling the message type
// This is a custom implementation to help route the messages from kafka, applying to all messages from the "game" topic
type ServiceMessage struct {
	MessageType string      `json:"messageType" bson:"messageType"`
	Body        interface{} `json:"body" bson:"body"`
}

// ServeFiles from the static/views directory - useful for sending plain HTML to visualize content.
func ServeFiles(w http.ResponseWriter, r *http.Request) {
	p := "." + r.URL.Path
	if p == "./" {
		p = "./views/index.html"
	}
	http.ServeFile(w, r, p)
}

// Login gives a signed token to authenticate a user.
// This is used because Android has poor support for cookies, so a session cookie isn't easy.
// We shouldn't store stateful information in this, only information to reference the actual user.
// But there's no auth login yet, so just trust this.
// This might have the advantage of speedier websocket reconnects.
func Login(jwtSigningKey []byte, encryptionKey []byte) http.HandlerFunc {
	fn := func(w http.ResponseWriter, r *http.Request) {
		// Parse input
		dec := json.NewDecoder(r.Body)
		var loginObject struct {
			Username string `json:"username"`
		}
		decodeInputError := dec.Decode(&loginObject)
		if decodeInputError != nil {
			buf := new(strings.Builder)
			numberOfBytes, copyBodyToBufferError := io.Copy(buf, r.Body)
			if copyBodyToBufferError != nil {
				w.WriteHeader(http.StatusBadRequest)
				json.NewEncoder(w).Encode(&responses.HTTPBasic{
					Status:      http.StatusBadRequest,
					Description: fmt.Sprintf("Invalid input - couldn't even parse request with byte count %s", string(numberOfBytes)),
					IsError:     true,
				})
				return
			}
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusBadRequest,
				Description: fmt.Sprintf("Invalid input - %s - %s", decodeInputError, buf.String()),
				IsError:     true,
			})
		}

		// Verify login
		log.Println("attempting to log in with JWT", loginObject.Username)

		// Generate the JWT
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"username": loginObject.Username,
		})

		// Sign and get the complete encoded token as a string using the secret
		jwtString, signStringErr := token.SignedString(jwtSigningKey)
		if signStringErr != nil {
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusInternalServerError,
				Description: fmt.Sprintf("Couldn't sign the string: %s %v", []byte(viper.GetString("JWT_SIGNING_KEY")), signStringErr),
				IsError:     true,
			})
			return
		}
		encryptedJwt := authmiddleware.Encrypt([]byte(jwtString), encryptionKey)

		// Communicate success
		log.Println("logged in", loginObject.Username)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(&responses.HTTPBasic{
			Status:      200,
			Description: "Logged in",
			IsError:     false,
			Body:        hex.EncodeToString(encryptedJwt),
		})
	}
	return http.HandlerFunc(fn)
}

// GetLive websocket connection
func GetLive(client storage.Client, queueProducer *kafka.Writer, queueConsumer *kafka.Reader) http.HandlerFunc {
	var protocols []string
	connections := make(map[primitive.ObjectID]*websocket.Conn)

	gameStore := gameRepository.GetGameStore(client)

	// Setup the outgoing messages
	// Copy from below, just push the message into the kafka queue
	// We should pass in a channel that terminates after the below for loop.
	go monitorServerMessageQueue(queueConsumer, &connections, gameStore)

	// Reconnecting and picking up is another big question :(

	// Also, limiting number of connections is another nice to have :)

	fn := func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		authToken, isAuthTokenSet := ctx.Value(authmiddleware.AuthTokenContextKey).(string)
		if !isAuthTokenSet {
			log.Printf("Couldn't get auth token from context - could be missing from the sec-websocket-protocol header - %v", isAuthTokenSet)
			w.WriteHeader(http.StatusForbidden)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusForbidden,
				Description: fmt.Sprintf("Couldn't upgrade connection"),
				IsError:     true,
			})
			return
		}
		timeout, _ := time.ParseDuration("10s")
		upgrader := websocket.Upgrader{
			ReadBufferSize:   1024,
			WriteBufferSize:  1024,
			Subprotocols:     append(protocols, authToken), // If we reused the upgrader, we need a way of managing the protocols, like we are with the socket connections.
			HandshakeTimeout: timeout,
		}
		// Whitelist all origins if in local development
		if viper.GetString("ENV") == "development" {
			upgrader.CheckOrigin = func(r *http.Request) bool { return true }
		}

		activeUsername, isUsernameSet := ctx.Value(authmiddleware.UsernameContextKey).(string)
		if !isUsernameSet {
			log.Printf("Username isn't set in the session")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusBadRequest,
				Description: fmt.Sprintf("User not in a session - %", activeUsername),
				IsError:     true,
			})
			return
		}

		activeGame, isActiveGameSet := ctx.Value(authmiddleware.ActiveGameContextKey).(string)
		if !isActiveGameSet {
			// Currently difficult to set this session var when using websockets.
			// I've been instead hardcoding this block directly to the game I'm trying to join.
			// Not sustainable. When it comes to testing within the app instead of via postman requests, I can re-evaluate.
			// Could also create a specific test environment if need be.
			log.Printf("Game isn't set in the session")
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusBadRequest,
				Description: fmt.Sprintf("User not in a game - %", activeGame),
				IsError:     true,
			})
			return
		}

		gameID, activeGameParseError := primitive.ObjectIDFromHex(activeGame)
		if activeGameParseError != nil {
			log.Printf("Game %s in session isn't valid: %v", activeGame, activeGameParseError)
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusBadRequest,
				Description: fmt.Sprintf("No active game found for user - %s", activeGame),
				IsError:     true,
			})
			return
		}

		// Set the headers to match the client
		h := http.Header{}
		for _, sub := range websocket.Subprotocols(r) {
			if sub == authToken {
				h.Set("Sec-Websocket-Protocol", authToken)
				break
			}
		}

		// Upgrade the connection to a websocket
		connection, upgradeErr := upgrader.Upgrade(w, r, h)
		defer connection.Close()

		if upgradeErr != nil {
			log.Printf("Couldn't upgrade connection - %s", upgradeErr)
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusInternalServerError,
				Description: fmt.Sprintf("Couldn't upgrade connection"),
				IsError:     true,
			})
			return
		}
		connectionID := primitive.NewObjectID()
		connections[connectionID] = connection
		defer delete(connections, connectionID)

		// Start the websocket loop
		monitorClientMessageQueue(gameStore, connection, queueProducer, gameID, activeUsername)

	}
	return http.HandlerFunc(fn)
}

// JoinGame sets up a session and saves the user into the game
func JoinGame(client storage.Client, jwtSigningKey []byte, encryptionKey []byte) http.HandlerFunc {
	gameStore := gameRepository.GetGameStore(client)
	fn := func(w http.ResponseWriter, r *http.Request) {
		// Parse input
		dec := json.NewDecoder(r.Body)
		var joinGameObject struct {
			GameID string `json:"gameID"`
		}
		decodeInputError := dec.Decode(&joinGameObject)
		if decodeInputError != nil {
			buf := new(strings.Builder)
			numberOfBytes, copyBodyToBufferError := io.Copy(buf, r.Body)
			if copyBodyToBufferError != nil {
				w.WriteHeader(http.StatusBadRequest)
				json.NewEncoder(w).Encode(&responses.HTTPBasic{
					Status:      http.StatusBadRequest,
					Description: fmt.Sprintf("Invalid input - couldn't even parse request with byte count %s", string(numberOfBytes)),
					IsError:     true,
				})
				return
			}
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusBadRequest,
				Description: fmt.Sprintf("Invalid input - %s - %s", decodeInputError, buf.String()),
				IsError:     true,
			})
		}

		// Validate operation
		ctx := r.Context()
		usernameJoiningGame := ctx.Value(authmiddleware.UsernameContextKey).(string) // check that not already in a game
		activeGame := ctx.Value(authmiddleware.ActiveGameContextKey)                 // check that not already in a game
		if activeGame != nil {
			w.WriteHeader(http.StatusConflict)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusConflict,
				Description: fmt.Sprintf("already in a game - %s", activeGame),
				IsError:     true,
			})
			return
		}

		shortTimeoutContext, cancelGetGames := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancelGetGames()

		// Extract the object ID from the encoded hex passed over HTTP.
		idToFetch, inputErr := primitive.ObjectIDFromHex(joinGameObject.GameID)
		if inputErr != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusBadRequest,
				Description: fmt.Sprintf("Invalid input - %s", joinGameObject.GameID),
				IsError:     true,
			})
			return
		}

		// Get the game, and validate we can add to it.
		isPlayerInGame := false
		isGameOver := false
		gameToJoin, getGameErr := gameRepository.FindOne(gameStore, shortTimeoutContext, bson.M{"_id": idToFetch})
		switch getGameErr {
		case nil:
			// Check player not already in game
			for _, player := range gameToJoin.State.Players {
				if player.Name == usernameJoiningGame {
					isPlayerInGame = true
				}
			}
			if gameToJoin.State.Winner != "" {
				isGameOver = true
			}
		case mongo.ErrNoDocuments:
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusNotFound,
				Description: fmt.Sprintf("No game documents found for %v", idToFetch),
				IsError:     true,
			})
			return
		default:
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusInternalServerError,
				Description: "unknown error",
				IsError:     true,
			})
			return
		}

		if isPlayerInGame {
			w.WriteHeader(http.StatusConflict)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusConflict,
				Description: "already in the game",
				IsError:     true,
			})
			return
		}

		if isGameOver {
			log.Printf("%s tried to join a game which was already finished, with winner %s", usernameJoiningGame, gameToJoin.State.Winner)
			w.WriteHeader(http.StatusGone)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusGone,
				Description: "Game already finished",
				IsError:     true,
			})
			return
		}

		// Perform operation
		// Add player to game object
		updateResult, updateError := gameRepository.Update(gameStore, shortTimeoutContext, bson.M{"_id": idToFetch}, bson.M{
			"$push": &bson.M{
				"state.players": &models.Player{
					Name:        usernameJoiningGame,
					CardsInHand: make([]models.Card, 0),
					CardsInPlay: make([]models.Card, 0),
				},
			},
		}, &options.UpdateOptions{})
		switch updateError {
		case nil:
			log.Println("Updated game successfully", joinGameObject.GameID, "with count", updateResult.ModifiedCount)
		case mongo.ErrNoDocuments:
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusNotFound,
				Description: fmt.Sprintf("No game documents found for %v", joinGameObject.GameID),
				IsError:     true,
			})
		default:
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusInternalServerError,
				Description: "unknown error",
				IsError:     true,
			})
		}

		// Generate the new JWT with the active game field
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"username":   usernameJoiningGame,
			"activegame": joinGameObject.GameID,
		})

		// Sign and get the complete encoded token as a string using the secret
		jwtString, signStringErr := token.SignedString(jwtSigningKey)
		if signStringErr != nil {
			log.Printf("Couldn't sign the string when joining the game for user %s: %v", usernameJoiningGame, signStringErr)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusInternalServerError,
				Description: fmt.Sprintf("Couldn't sign the string when joining the game"),
				IsError:     true,
			})
			return
		}
		encryptedJwt := authmiddleware.Encrypt([]byte(jwtString), encryptionKey)

		// Communicate
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(&responses.HTTPBasic{
			Status:      200,
			Description: "Updated successfully",
			IsError:     false,
			Body:        hex.EncodeToString(encryptedJwt),
		})
	}
	return http.HandlerFunc(fn)
}

// LeaveGame removes a user from their current game
func LeaveGame(client storage.Client, jwtSigningKey []byte, encryptionKey []byte) http.HandlerFunc {
	gameStore := gameRepository.GetGameStore(client)
	fn := func(w http.ResponseWriter, r *http.Request) {
		// Parse input
		ctx := r.Context()
		usernameLeavingGame, isUsernameSet := ctx.Value(authmiddleware.UsernameContextKey).(string)
		activeGame, isActiveGameSet := ctx.Value(authmiddleware.ActiveGameContextKey).(string)

		// Validate operation
		if !isUsernameSet {
			w.WriteHeader(http.StatusForbidden)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusForbidden,
				Description: fmt.Sprintf("no user set - %s", usernameLeavingGame),
				IsError:     true,
			})
			return
		}
		if !isActiveGameSet {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusBadRequest,
				Description: fmt.Sprintf("not in a game - %s", activeGame),
				IsError:     true,
			})
			return
		}
		// Extract the object ID from the encoded hex passed over HTTP.
		idToFetch, inputErr := primitive.ObjectIDFromHex(activeGame)
		if inputErr != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusBadRequest,
				Description: fmt.Sprintf("Invalid session - %s", activeGame),
				IsError:     true,
			})
			return
		}

		shortTimeoutContext, cancelGetGames := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancelGetGames()

		// Perform operation
		// Remove player from the game object
		updateResult, updateError := gameRepository.Update(gameStore, shortTimeoutContext, bson.M{"_id": idToFetch}, bson.M{
			"$pull": &bson.M{
				"state.players": &bson.M{
					"name": &bson.M{
						"$eq": usernameLeavingGame,
					},
				},
			},
		}, &options.UpdateOptions{})
		switch updateError {
		case nil:
			log.Println("Updated game successfully", activeGame, "with count", updateResult.ModifiedCount)
		case mongo.ErrNoDocuments:
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusNotFound,
				Description: fmt.Sprintf("No game documents found for %v", activeGame),
				IsError:     true,
			})
			return
		default:
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusInternalServerError,
				Description: "unknown error",
				IsError:     true,
			})
			return
		}

		// Generate the new JWT without the active game field
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"username": usernameLeavingGame,
		})

		// Sign and get the complete encoded token as a string using the secret
		jwtString, signStringErr := token.SignedString(jwtSigningKey)
		if signStringErr != nil {
			log.Printf("Couldn't sign the string when leaving the game for user %s: %v", usernameLeavingGame, signStringErr)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusInternalServerError,
				Description: fmt.Sprintf("Couldn't sign the string when leaving the game", signStringErr),
				IsError:     true,
			})
			return
		}
		encryptedJwt := authmiddleware.Encrypt([]byte(jwtString), encryptionKey)

		// Communicate
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(&responses.HTTPBasic{
			Status:      200,
			Description: "Updated successfully",
			IsError:     false,
			Body:        hex.EncodeToString(encryptedJwt),
		})
	}
	return http.HandlerFunc(fn)
}

// GetGames get all active games
func GetGames(client storage.Client) http.HandlerFunc {
	// gamesCollection := db.Database("du-meine-gute").Collection("games")
	gameStore := gameRepository.GetGameStore(client)
	fn := func(w http.ResponseWriter, r *http.Request) {
		shortTimeoutContext, cancelGetGames := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancelGetGames()
		games, err := gameRepository.Find(gameStore, shortTimeoutContext, bson.D{})
		if err != nil {
			log.Fatal(err)
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(games)
	}
	return http.HandlerFunc(fn)
}

// GetGame get a single game
func GetGame(client storage.Client) http.HandlerFunc {
	gameStore := gameRepository.GetGameStore(client)
	fn := func(w http.ResponseWriter, r *http.Request) {
		shortTimeoutContext, cancelGetGames := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancelGetGames()
		w.Header().Set("Content-Type", "application/json")
		stringID := chi.URLParam(r, "gameID")
		idToFetch, inputErr := primitive.ObjectIDFromHex(stringID)
		if inputErr != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusBadRequest,
				Description: fmt.Sprintf("Invalid input - %s", stringID),
				IsError:     true,
			})
			return
		}
		game, err := gameRepository.FindOne(gameStore, shortTimeoutContext, bson.M{"_id": idToFetch})
		switch err {
		case nil:
			json.NewEncoder(w).Encode(game)
		case mongo.ErrNoDocuments:
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusNotFound,
				Description: fmt.Sprintf("No game documents found for %v", stringID),
				IsError:     true,
			})
		default:
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusInternalServerError,
				Description: "unknown error",
				IsError:     true,
			})
		}
	}
	return http.HandlerFunc(fn)
}

// CreateGame create a new game
func CreateGame(client storage.Client) http.HandlerFunc {

	gameStore := gameRepository.GetGameStore(client)
	fn := func(w http.ResponseWriter, r *http.Request) {
		dec := json.NewDecoder(r.Body)

		// Decode the game from the request body.
		var game models.Game
		decodeInputError := dec.Decode(&game)
		game.State.CardsInDeck = make([]models.Card, 0)
		game.State.Players = make([]models.Player, 0)
		if decodeInputError != nil {
			buf := new(strings.Builder)
			numberOfBytes, copyBodyToBufferError := io.Copy(buf, r.Body)
			if copyBodyToBufferError != nil {
				w.WriteHeader(http.StatusBadRequest)
				json.NewEncoder(w).Encode(&responses.HTTPBasic{
					Status:      http.StatusBadRequest,
					Description: fmt.Sprintf("Invalid input - couldn't even parse request with byte count %s", string(numberOfBytes)),
					IsError:     true,
				})
				return
			}
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusBadRequest,
				Description: fmt.Sprintf("Invalid input - %s - %s", decodeInputError, buf.String()),
				IsError:     true,
			})
			return
		}
		game.ID = primitive.NewObjectID()
		shortTimeoutContext, cancelCreateGame := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancelCreateGame()
		w.Header().Set("Content-Type", "application/json")
		insertedGame, insertError := gameStore.InsertOne(shortTimeoutContext, &game)
		if insertError != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusInternalServerError,
				Description: fmt.Sprintf("Couldn't insert game - %s", insertError),
				IsError:     true,
			})
			return
		}
		json.NewEncoder(w).Encode(insertedGame)
	}
	return http.HandlerFunc(fn)
}

// GetStatus check the status of the server by returning a json alive string.
func GetStatus(w http.ResponseWriter, r *http.Request) {
	// A very simple health check.
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")

	// In the future we could report back on the status of our DB, or our cache
	// (e.g. Redis) by performing a simple PING, and include them in the response.
	io.WriteString(w, `{"alive": true}`)
}
