package handlers

import (
	"context"
	"fmt"
	"log"
	"time"

	gameRepository "github.com/Jaeger2305/du-meine-gute/repository"
	"github.com/Jaeger2305/du-meine-gute/storage"
	cards "github.com/Jaeger2305/du-meine-gute/storage/cards"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func drawCard() string {
	return "drawn card"
}

func playCard() string {
	return "played card"
}

func ready(gameStore storage.Collection, idToFetch primitive.ObjectID) string {
	initialCards := cards.GetCards()
	shortTimeoutContext, cancelUpdateGame := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancelUpdateGame()
	updateResult, updateError := gameRepository.Update(gameStore, shortTimeoutContext, bson.M{"_id": idToFetch}, bson.M{
		"$push": &bson.M{
			"State.CardsInDeck": initialCards,
		},
	})
	switch updateError {
	case nil:
		log.Println("Updated game successfully", idToFetch, "with count", updateResult.ModifiedCount)
	}
	return "readied game"
}

func status() string {
	return "status fine"
}

// RouteIncomingMessage handles incoming websocket messages, and calls the appropriate function handlers.
func RouteIncomingMessage(message string, gameStore storage.Collection, idToFetch primitive.ObjectID) (string, error) {
	switch message {
	case "drawCard":
		drawCard()
		return "success", nil
	case "playCard":
		playCard()
		return "success", nil
	case "ready":
		ready(gameStore, idToFetch)
		return "success", nil
	case "status":
		status()
		return "success", nil
	default:
		return "", fmt.Errorf("Message not understood %v", message)
	}
}

// RouteOutgoingMessage handles outgoing websocket messages, and calls the appropriate function handlers.
func RouteOutgoingMessage(message string) (int, string, error) {
	switch message {
	case "success":
		return 2, "success", nil
	case "drawCard":
		return 3, "drawCard", nil
	}
	return 1, "error", nil
}
