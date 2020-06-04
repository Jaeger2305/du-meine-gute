package main

import (
	"log"
	"net/http"
	"time"

	"github.com/Jaeger2305/du-meine-gute/storage"
	"github.com/spf13/viper"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/Jaeger2305/du-meine-gute/handlers"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
)

func main() {
	setupConfig()
	httpPort := viper.GetString("DMG_PORT")

	client := storage.NewClient(mongo.Connect, viper.GetString("DMG_CONNECTION_STRING"))
	// defer client.Disconnect(context.background())

	router := chi.NewRouter()

	// Middleware setup
	router.Use(middleware.RequestID)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	router.Use(middleware.Timeout(60 * time.Second))

	// REST API
	// router.Get("/", handlers.ServeFiles)
	router.Get("/games", handlers.GetGames(client))
	// router.Get("/games", handlers.HandlerFunc{env, handlers.GetGames})
	// router.Post("/games/join", handlers.JoinGame)
	// router.Get("/status", handlers.GetStatus)
	// router.Get("/games/live", handlers.GetLive)

	log.Printf("Running on port %s\n", httpPort)
	log.Fatal(http.ListenAndServe(":"+httpPort, router))
}
