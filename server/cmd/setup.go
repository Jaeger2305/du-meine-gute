package main

import (
	"net/http"
	"time"

	"github.com/Jaeger2305/du-meine-gute/handlers"
	"github.com/Jaeger2305/du-meine-gute/storage"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/segmentio/kafka-go"
	"github.com/segmentio/kafka-go/snappy"
	"github.com/spf13/viper"
)

func setupConfig() {
	viper.SetEnvPrefix("dmg")
	viper.AutomaticEnv()
}

func setupMessageQueue(brokerUrls []string, clientID string, topic string) *kafka.Writer {
	dialer := &kafka.Dialer{
		Timeout:  10 * time.Second,
		ClientID: clientID,
	}

	config := kafka.WriterConfig{
		Brokers:          brokerUrls,
		Topic:            topic,
		Balancer:         &kafka.LeastBytes{},
		Dialer:           dialer,
		WriteTimeout:     10 * time.Second,
		ReadTimeout:      10 * time.Second,
		CompressionCodec: snappy.NewCompressionCodec(),
	}
	return kafka.NewWriter(config)
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
	router.Post("/game", handlers.CreateGame(client))
	router.With(authorised(client, sessionManager)).Post("/game/join", handlers.JoinGame(client, sessionManager))
	router.With(authorised(client, sessionManager)).Post("/game/leave", handlers.LeaveGame(client, sessionManager))
	router.Post("/login", handlers.Login(client, sessionManager))
	// router.Get("/status", handlers.GetStatus)
	router.With(authorised(client, sessionManager)).Get("/game/live", handlers.GetLive(client, sessionManager))
	return router
}

func authorised(client storage.Client, sessionManager storage.SessionManager) func(http.Handler) http.Handler {
	fn := func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			session, _ := sessionManager.SessionStart(w, r)
			defer session.SessionRelease(w)

			// If in development, skip authentication.
			if viper.GetString("ENV") == "development" {
				session.Set("username", "testuser")
				session.SessionRelease(w)
				next.ServeHTTP(w, r)
				return
			}

			username := session.Get("username")
			if username == nil {
				http.Error(w, http.StatusText(403), 403)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
	return fn
}
