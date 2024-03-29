package main

import (
	"context"
	"log"
	"net/http"
	"strings"

	"github.com/Jaeger2305/du-meine-gute/authmiddleware"
	"github.com/Jaeger2305/du-meine-gute/storage"
	"github.com/spf13/viper"
)

func main() {
	setupConfig()
	log.Printf("set up config")

	client := storage.NewClient(&storage.MongoConnector{}, viper.GetString("CONNECTION_STRING"))
	defer client.Disconnect(context.Background())
	log.Printf("set up db client")

	sessionManager := storage.NewSessionManager()
	log.Printf("set up session manager")

	brokerUrls := strings.Split(viper.GetString("MESSAGE_QUEUE_BROKER_URLS"), ",")
	messageQueueClientID := viper.GetString("MESSAGE_QUEUE_CLIENT_ID")
	messageQueueTopic := viper.GetString("MESSAGE_QUEUE_TOPIC")
	queueProducer, queueConsumer := setupMessageQueue(brokerUrls, messageQueueClientID, messageQueueTopic)
	defer queueProducer.Close()
	defer queueConsumer.Close()
	log.Printf("set up message queue")

	encryptionKey := authmiddleware.CreateHash(viper.GetString("ENCRYPTION_KEY"))
	router := setupRoutes(client, sessionManager, queueProducer, queueConsumer, []byte(viper.GetString("JWT_SIGNING_KEY")), encryptionKey)
	log.Printf("set up routes")

	httpHost := viper.GetString("HOST")
	httpPort := viper.GetString("PORT")
	log.Printf("Running on host %s port %s\n", httpHost, httpPort)
	log.Fatal(http.ListenAndServe(httpHost+":"+httpPort, router))
}
