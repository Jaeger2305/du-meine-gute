package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

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

// Error represents a handler error. It provides methods for a HTTP status
// code and embeds the built-in error interface.
type Error interface {
	error
	Status() int
}

// StatusError represents an error with an associated HTTP status code.
type StatusError struct {
	Code int
	Err  error
}

// Error adapted to satisfy the status error interface.
func (se StatusError) Error() string {
	return se.Err.Error()
}

// Status adapted for the HTTP status code.
func (se StatusError) Status() int {
	return se.Code
}

// Env the application-wide configuration
type Env struct {
	DB   storage.Client
	Port string
	Host string
}

// HandlerFunc is the struct that takes a configured Env and a function matching
// our useful signature.
type HandlerFunc struct {
	*Env
	H func(e *Env, w http.ResponseWriter, r *http.Request) error
}

// Game - represents the state of an individual game.
type Game struct {
	Name string `json:"name"`
}

// ServeFiles from the static/views directory - useful for sending plain HTML to visualize content.
func ServeFiles(w http.ResponseWriter, r *http.Request) {
	p := "." + r.URL.Path
	if p == "./" {
		p = "./views/index.html"
	}
	http.ServeFile(w, r, p)
}

// Login sets up a user's session. Currently no auth or anything.
func Login(client storage.Client, sessionManager storage.SessionManager) http.HandlerFunc {
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
		log.Println("attempting to log in", loginObject.Username)

		// Update the session
		sess, _ := sessionManager.SessionStart(w, r)
		defer sess.SessionRelease(w)
		sess.Set("username", loginObject.Username)

		// Communicate success
		log.Println("logged in", loginObject.Username)

		sess.SessionRelease(w)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(&responses.HTTPBasic{
			Status:      200,
			Description: "Logged in",
			IsError:     false,
		})
	}
	return http.HandlerFunc(fn)
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// GetLive websocket connection
func GetLive(client storage.Client, sessionManager storage.SessionManager, queueProducer *kafka.Writer, queueConsumer *kafka.Reader) http.HandlerFunc {
	// Whitelist all origins if in local development
	if viper.GetString("ENV") == "development" {
		upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	}

	gameStore := gameRepository.GetGameStore(client)

	fn := func(w http.ResponseWriter, r *http.Request) {
		session, sessionStartErr := sessionManager.SessionStart(w, r)
		defer session.SessionRelease(w)

		if sessionStartErr != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusInternalServerError,
				Description: fmt.Sprintf("Couldn't start a session"),
				IsError:     true,
			})
			return
		}

		activeUsername, isUsernameSet := session.Get("username").(string)
		if !isUsernameSet {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusBadRequest,
				Description: fmt.Sprintf("User not in a session - %", activeUsername),
				IsError:     true,
			})
			return
		}

		activeGame, isActiveGameSet := session.Get("activegame").(string)
		if !isActiveGameSet {
			// Currently difficult to set this session var when using websockets.
			// I've been instead hardcoding this block directly to the game I'm trying to join.
			// Not sustainable. When it comes to testing within the app instead of via postman requests, I can re-evaluate.
			// Could also create a specific test environment if need be.
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
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusBadRequest,
				Description: fmt.Sprintf("No active game found for user - %s", activeGame),
				IsError:     true,
			})
			return
		}

		connection, upgradeErr := upgrader.Upgrade(w, r, nil)
		defer connection.Close()

		if upgradeErr != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusInternalServerError,
				Description: fmt.Sprintf("Couldn't upgrade connection - %s", upgradeErr),
				IsError:     true,
			})
			return
		}

		// Setup the outgoing messages
		// Copy from below, just push the message into the kafka queue
		// We should pass in a channel that terminates after the below for loop.
		go monitorServerMessageQueue(queueConsumer, connection, gameStore)

		// Start the websocket loop
		monitorClientMessageQueue(gameStore, connection, queueProducer, gameID, activeUsername)

	}
	return http.HandlerFunc(fn)
}

func monitorClientMessageQueue(gameStore storage.Collection, connection *websocket.Conn, queueProducer *kafka.Writer, idToFetch primitive.ObjectID, playerUsername string) {
	for {
		_, clientMessage, readClientMessageErr := connection.ReadMessage()
		if readClientMessageErr != nil {
			log.Printf("Couldn't read client message when monitoring the websocket connection: %v", readClientMessageErr)
			return
		}
		log.Println(string(clientMessage))

		routeIncomingMessageErr := RouteIncomingMessage(string(clientMessage), gameStore, idToFetch, playerUsername, queueProducer)
		if routeIncomingMessageErr != nil {
			log.Printf("Failed to work out what to do with the incoming message: %v", routeIncomingMessageErr)
		}
	}
}

func monitorServerMessageQueue(queueConsumer *kafka.Reader, connection *websocket.Conn, gameStore storage.Collection) {
	for {
		// Get the raw message
		// This is done in every go routine, and is therefore probably a good area for optimisation.
		m, messageQueueReadErr := queueConsumer.ReadMessage(context.Background())
		if messageQueueReadErr != nil {
			log.Printf("error while receiving message: %v", messageQueueReadErr)
			continue
		}
		log.Printf("message at topic/partition/offset %v/%v/%v: %s", m.Topic, m.Partition, m.Offset, string(m.Value))

		// Unmarshal to a JSON message
		var parsedServerMessage ServiceMessage
		if parseServerMessageErr := json.Unmarshal(m.Value, &parsedServerMessage); parseServerMessageErr != nil {
			log.Printf("Couldn't parse server message from kafka %v", parseServerMessageErr)
		}

		outgoingMessages, routeOutgoingMessageErr := RouteOutgoingMessage(parsedServerMessage, gameStore)
		if routeOutgoingMessageErr != nil {
			log.Printf("Couldn't handle the outgoing message router: %v", routeOutgoingMessageErr)
		}
		for _, outgoingMessage := range outgoingMessages {
			// If the message isn't relevant for this connection, skip it.
			log.Println("Currently, all messages are sent to the connection, regardless of origin! TODO.")

			// Serialise the message for transport over websocket
			serialisedOutgoingMessage, serialiseErr := json.Marshal(outgoingMessage)
			if serialiseErr != nil {
				log.Printf("Couldn't serialise message: %v.", serialiseErr)
				return
			}

			// Send the message through the websocket
			if writeWebsocketMessageErr := connection.WriteMessage(websocket.TextMessage, serialisedOutgoingMessage); writeWebsocketMessageErr != nil {
				log.Printf("Couldn't write to the websocket - it might be have dropped from the client or server side: %v", writeWebsocketMessageErr)
				return
			}
		}
	}
}

// JoinGame sets up a session and saves the user into the game
func JoinGame(client storage.Client, sessionManager storage.SessionManager) http.HandlerFunc {
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

		sess, sessionStartErr := sessionManager.SessionStart(w, r)
		defer sess.SessionRelease(w)
		if sessionStartErr != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusInternalServerError,
				Description: fmt.Sprintf("Couldn't start a session"),
				IsError:     true,
			})
			return
		}

		// Validate operation
		activeGame := sess.Get("activegame") // check that not already in a game
		if activeGame != nil {
			w.WriteHeader(http.StatusConflict)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusConflict,
				Description: fmt.Sprintf("already in a game - %s", activeGame),
				IsError:     true,
			})
			return
		}

		usernameJoiningGame, isUsernameSet := sess.Get("username").(string)

		if !isUsernameSet {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusUnauthorized,
				Description: fmt.Sprintf("no username set when trying to join game - %s", activeGame),
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
		gameToJoin, getGameErr := gameRepository.FindOne(gameStore, shortTimeoutContext, bson.M{"_id": idToFetch})
		switch getGameErr {
		case nil:
			// Check player not already in game
			for _, player := range gameToJoin.State.Players {
				if player.Name == usernameJoiningGame {
					isPlayerInGame = true
				}
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

		// Update session
		setActiveGameSessionErr := sess.Set("activegame", joinGameObject.GameID)
		if setActiveGameSessionErr != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusInternalServerError,
				Description: fmt.Sprintf("Couldn't update active game in user's session - %s", joinGameObject.GameID),
				IsError:     true,
			})
			return
		}

		// Communicate
		sess.SessionRelease(w) // commits updates to provider, and must be before writing to header, so we can't defer this.
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(&responses.HTTPBasic{
			Status:      200,
			Description: "Updated successfully",
			IsError:     false,
		})
	}
	return http.HandlerFunc(fn)
}

// LeaveGame removes a user from their current game
func LeaveGame(client storage.Client, sessionManager storage.SessionManager) http.HandlerFunc {
	gameStore := gameRepository.GetGameStore(client)
	fn := func(w http.ResponseWriter, r *http.Request) {
		// Parse input
		sess, sessionStartErr := sessionManager.SessionStart(w, r)
		defer sess.SessionRelease(w)
		if sessionStartErr != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusInternalServerError,
				Description: fmt.Sprintf("Couldn't start a session"),
				IsError:     true,
			})
			return
		}
		usernameLeavingGame := sess.Get("username").(string)

		// Validate operation
		activeGame := sess.Get("activegame") // check that not already in a game
		if activeGame == nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusBadRequest,
				Description: fmt.Sprintf("not in a game - %s", activeGame),
				IsError:     true,
			})
			return
		} // Extract the object ID from the encoded hex passed over HTTP.
		idToFetch, inputErr := primitive.ObjectIDFromHex(activeGame.(string))
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

		// Update session
		setActiveGameSessionErr := sess.Delete("activegame")
		if setActiveGameSessionErr != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusInternalServerError,
				Description: fmt.Sprintf("Couldn't update active game in user's session - %s", usernameLeavingGame),
				IsError:     true,
			})
			return
		}
		sess.SessionRelease(w) // commits updates to provider, and must be before writing to header, so we can't defer this.

		// Communicate
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(&responses.HTTPBasic{
			Status:      200,
			Description: "Updated successfully",
			IsError:     false,
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
