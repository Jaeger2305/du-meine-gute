package handlers

import (
	"encoding/json"
	"io"
	"net/http"
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
