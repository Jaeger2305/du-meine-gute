package main

import (
	"fmt"
	"time"

	"github.com/Jaeger2305/du-meine-gute/handlers"
	"github.com/Jaeger2305/du-meine-gute/storage"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/spf13/viper"
)

func setupConfig() {
	viper.SetConfigName("default")
	viper.SetConfigType("env")
	viper.SetEnvPrefix("dmg")
	viper.AddConfigPath(".")
	err := viper.ReadInConfig() // Find and read the config file
	if err != nil {             // Handle errors reading the config file
		panic(fmt.Errorf("Fatal error config file: %s", err))
	}
	viper.AutomaticEnv()
}

func setupRoutes(client storage.Client) *chi.Mux {
	router := chi.NewRouter()

	// Middleware setup
	router.Use(middleware.RequestID)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	router.Use(middleware.Timeout(60 * time.Second))

	// REST API
	// router.Get("/", handlers.ServeFiles)
	router.Get("/games", handlers.GetGames(client))
	router.Get("/game/{gameID}", handlers.GetGame(client))
	// router.Post("/games/join", handlers.JoinGame)
	// router.Get("/status", handlers.GetStatus)
	// router.Get("/games/live", handlers.GetLive)
	return router
}
