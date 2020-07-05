package main

import (
	"context"
	"log"
	"net/http"

	"github.com/Jaeger2305/du-meine-gute/storage"
	"github.com/spf13/viper"
)

func main() {
	setupConfig()
	client := storage.NewClient(&storage.MongoConnector{}, viper.GetString("DMG_CONNECTION_STRING"))
	sessionManager := storage.NewSessionManager()
	defer client.Disconnect(context.Background())
	router := setupRoutes(client, sessionManager)

	httpPort := viper.GetString("DMG_PORT")
	log.Printf("Running on port %s\n", httpPort)
	log.Fatal(http.ListenAndServe(":"+httpPort, router))
}
