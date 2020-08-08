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
	log.Printf("set up config")
	client := storage.NewClient(&storage.MongoConnector{}, viper.GetString("DMG_CONNECTION_STRING"))
	log.Printf("set up db client")
	sessionManager := storage.NewSessionManager()
	log.Printf("set up session manager")
	defer client.Disconnect(context.Background())
	router := setupRoutes(client, sessionManager)
	log.Printf("set up routes")

	httpPort := viper.GetString("DMG_PORT")
	log.Printf("Running on port %s\n", httpPort)
	log.Fatal(http.ListenAndServe(":"+httpPort, router))
}
