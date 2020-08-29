package main

import (
	"time"

	"github.com/Jaeger2305/du-meine-gute/authmiddleware"
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

func setupMessageQueue(brokerUrls []string, clientID string, topic string) (*kafka.Writer, *kafka.Reader) {
	dialer := &kafka.Dialer{
		Timeout:  10 * time.Second,
		ClientID: clientID,
	}

	writeConfig := kafka.WriterConfig{
		Brokers:          brokerUrls,
		Topic:            topic,
		Balancer:         &kafka.LeastBytes{},
		Dialer:           dialer,
		WriteTimeout:     10 * time.Second,
		ReadTimeout:      10 * time.Second,
		CompressionCodec: snappy.NewCompressionCodec(),
	}

	readConfig := kafka.ReaderConfig{
		Brokers:         brokerUrls,
		GroupID:         clientID,
		Topic:           topic,
		MinBytes:        10e3,            // 10KB
		MaxBytes:        10e6,            // 10MB
		MaxWait:         1 * time.Second, // Maximum amount of time to wait for new data to come when fetching batches of messages from kafka.
		ReadLagInterval: -1,
	}
	return kafka.NewWriter(writeConfig), kafka.NewReader(readConfig)
}

func setupRoutes(client storage.Client, sessionManager storage.SessionManager, queueProducer *kafka.Writer, queueConsumer *kafka.Reader, jwtSigningKey []byte, encryptionKey []byte) *chi.Mux {
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
	router.With(authmiddleware.Authorised(jwtSigningKey, encryptionKey)).Post("/game/join", handlers.JoinGame(client, jwtSigningKey, encryptionKey))
	router.With(authmiddleware.Authorised(jwtSigningKey, encryptionKey)).Post("/game/leave", handlers.LeaveGame(client, jwtSigningKey, encryptionKey))
	router.Post("/login", handlers.Login(jwtSigningKey, encryptionKey))
	// router.Get("/status", handlers.GetStatus)
	router.With(authmiddleware.Authorised(jwtSigningKey, encryptionKey)).Get("/game/live", handlers.GetLive(client, queueProducer, queueConsumer))
	return router
}
