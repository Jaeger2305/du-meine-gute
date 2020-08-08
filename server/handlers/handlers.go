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
func GetLive(w http.ResponseWriter, r *http.Request) {
	connection, err := upgrader.Upgrade(w, r, nil)
	defer connection.Close()
	if err != nil {
		log.Println(err)
		return
	}
	for {
		_, p, err := connection.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		response, err := RouteIncomingMessage(string(p))
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
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusBadRequest,
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

		// Perform operation
		// Add player to game object
		// Just update the name at the moment, as there's no array of players or anything yet.
		updateResult, updateError := gameRepository.Update(gameStore, shortTimeoutContext, bson.M{"_id": idToFetch}, bson.M{
			"$set": &bson.M{
				"name": sess.Get("username").(string),
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

// GetGames get all active games
func GetGames(client storage.Client) http.HandlerFunc {
	// gamesCollection := db.Database("du-meine-gute").Collection("games")
	gameStore := gameRepository.GetGameStore(client)
	// gameStore.InsertOne(context.TODO(), models.Game{
	// 	Name: "test-game-1",
	// })
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
		shortTimeoutContext, cancelCreateGame := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancelCreateGame()
		w.Header().Set("Content-Type", "application/json")
		insertedGame, insertError := gameStore.InsertOne(shortTimeoutContext, &game)
		if insertError != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(&responses.HTTPBasic{
				Status:      http.StatusInternalServerError,
				Description: fmt.Sprintf("Couldn't insert game"),
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
