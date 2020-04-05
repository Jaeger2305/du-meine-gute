package handlers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

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
func GetGames(w http.ResponseWriter, r *http.Request) {
	games := [2]Game{
		{Name: "test-game-1"},
		{Name: "test-game-2"},
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(games)
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
