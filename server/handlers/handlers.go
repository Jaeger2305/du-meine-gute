package handlers

import (
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"time"

	gameRepository "github.com/Jaeger2305/du-meine-gute/repository"
	"github.com/Jaeger2305/du-meine-gute/storage"
	models "github.com/Jaeger2305/du-meine-gute/storage/models"
	"github.com/gorilla/websocket"
	"go.mongodb.org/mongo-driver/bson"
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
	DB   storage.ClientHelper
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

// JoinGame get all active games
func JoinGame(w http.ResponseWriter, r *http.Request) {
	joinedGame := Game{
		Name: "test-game-1",
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(joinedGame)
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

// GetGames get all active games
func GetGames(client storage.ClientHelper) http.HandlerFunc {
	// gamesCollection := db.Database("du-meine-gute").Collection("games")
	gameStore := gameRepository.GetGameStore(client)
	// gameStore.InsertOne(context.TODO(), models.Test{
	// 	Name: "test-game-1",
	// })
	fn := func(w http.ResponseWriter, r *http.Request) {
		shortTimeoutContext, cancelGetGames := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancelGetGames()
		// gamesCursor, _ := gamesCollection.Find(shortTimeoutContext, bson.D{})
		// defer gamesCursor.Close(shortTimeoutContext)

		var games []models.Test
		// for gamesCursor.Next(shortTimeoutContext) {
		// 	game := models.Test{}
		// 	err := gamesCursor.Decode(&game)
		// 	if err != nil {
		// 		log.Fatal(err)
		// 	}
		// 	games = append(games, game)
		// }
		game, err := gameRepository.FindOne(gameStore, shortTimeoutContext, bson.D{})
		if err != nil {
			log.Fatal(err)
		}
		games = append(games, *game)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(games)
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
