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
	"github.com/spf13/viper"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
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
func GetLive(client storage.Client, sessionManager storage.SessionManager) http.HandlerFunc {
	// Whitelist all origins if in local development
	if viper.GetString("DMG_ENV") == "development" {
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

		idToFetch, activeGameParseError := primitive.ObjectIDFromHex(activeGame)
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

		// Start the websocket loop
		for {
			_, p, err := connection.ReadMessage()
			if err != nil {
				log.Println(err)
				return
			}
			response, err := RouteIncomingMessage(string(p), gameStore, idToFetch)
			if err != nil {
				log.Println(err)
			}
			log.Println(response)
			_, outgoingMessage, err := RouteOutgoingMessage(string(response))
			if err != nil {
				log.Println(err)
			}
			if outgoingMessage != "" {
				if err := connection.WriteMessage(websocket.TextMessage, []byte(outgoingMessage)); err != nil {
					log.Println(err)
					return
				}
			}
		}
	}
	return http.HandlerFunc(fn)
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
				"State.Players": &models.Player{
					Name: usernameJoiningGame,
				},
			},
		})
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
				"State.Players": &bson.M{
					"name": &bson.M{
						"$eq": usernameLeavingGame,
					},
				},
			},
		})
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
