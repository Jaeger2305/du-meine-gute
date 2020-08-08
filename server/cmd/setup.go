package main

import (
	"fmt"
	"net/http"
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

func setupRoutes(client storage.Client, sessionManager storage.SessionManager) *chi.Mux {
	router := chi.NewRouter()

	// Middleware setup
	router.Use(middleware.RequestID)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	router.Use(middleware.Timeout(60 * time.Second))

	// REST API
	router.Get("/", handlers.ServeFiles)
	router.Get("/game", handlers.GetGames(client))
	router.Get("/game/{gameID}", handlers.GetGame(client))
	router.Post("/games", handlers.CreateGame(client))
	router.With(authorised(client, sessionManager)).Post("/games/join", handlers.JoinGame(client, sessionManager))
	router.With(authorised(client, sessionManager)).Post("/games/leave", handlers.LeaveGame(client, sessionManager))
	router.Post("/login", handlers.Login(client, sessionManager))
	// router.Get("/status", handlers.GetStatus)
	router.With(authorised(client, sessionManager)).Get("/games/live", handlers.GetLive)
	return router
}

func authorised(client storage.Client, sessionManager storage.SessionManager) func(http.Handler) http.Handler {
	fn := func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			sess, _ := sessionManager.SessionStart(w, r)
			defer sess.SessionRelease(w)
			username := sess.Get("username")
			if username == nil {
				http.Error(w, http.StatusText(403), 403)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
	return fn
}
