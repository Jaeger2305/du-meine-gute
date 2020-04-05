package main

import (
	"log"
	"net/http"
	"os"

	"github.com/Jaeger2305/du-meine-gute/handlers"
)

func main() {
	httpPort := os.Getenv("PORT")
	if httpPort == "" {
		httpPort = "4444"
	}

	log.Printf("Running on port %s\n", httpPort)

	http.HandleFunc("/", handlers.GetGames)
	http.HandleFunc("/status", handlers.GetStatus)
	log.Fatal(http.ListenAndServe(":"+httpPort, nil))
}
