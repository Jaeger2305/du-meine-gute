package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/Jaeger2305/du-meine-gute/handlers"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
)

func main() {
	httpPort := os.Getenv("PORT")
	if httpPort == "" {
		httpPort = "4444"
	}

	log.Printf("Running on port %s\n", httpPort)

	router := chi.NewRouter()

	router.Use(middleware.RequestID)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	router.Use(middleware.Timeout(60 * time.Second))

	router.Get("/", handlers.ServeFiles)
	router.Get("/games", handlers.GetGames)
	router.Post("/games/join", handlers.JoinGame)
	router.Get("/status", handlers.GetStatus)

	log.Fatal(http.ListenAndServe(":"+httpPort, router))
}
