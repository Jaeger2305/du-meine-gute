package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	gameRepository "github.com/Jaeger2305/du-meine-gute/repository"
	"github.com/Jaeger2305/du-meine-gute/storage"
	cards "github.com/Jaeger2305/du-meine-gute/storage/cards"
	models "github.com/Jaeger2305/du-meine-gute/storage/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func drawCard(gameStore storage.Collection, gameID primitive.ObjectID, playerUsername string) string {
	shortTimeoutContext, cancelUpdateGame := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancelUpdateGame()
	activeGame, getGameErr := gameRepository.FindOne(gameStore, shortTimeoutContext, bson.M{"_id": gameID}) // Should have a projection too.
	if getGameErr != nil {
		log.Println("Couldn't get game", gameID.Hex(), getGameErr)
		return "error"
	}

	// Get the card
	cardsInDeck := activeGame.State.CardsInDeck
	if len(cardsInDeck) == 0 {
		log.Println("there are no cards left in the deck", gameID)
		return "error"
	}
	cardToDraw := cardsInDeck[0]

	// Update the state
	updateResult, updateError := gameRepository.Update(gameStore, shortTimeoutContext, bson.M{"_id": gameID}, bson.M{
		"$pull": &bson.M{
			"state.cardsInDeck": &bson.M{
				"name": cardToDraw.Name,
			},
		},
		"$push": &bson.M{
			"state.players.$[activePlayer].cardsInHand": bson.M{
				"name": cardToDraw.Name,
				"type": cardToDraw.Type,
			},
		},
	}, options.Update().SetArrayFilters(options.ArrayFilters{
		Filters: []interface{}{bson.M{"activePlayer.name": playerUsername}},
	}))

	switch updateError {
	case nil:
		log.Println("Updated game successfully", gameID, "with count", updateResult.ModifiedCount)
	case mongo.ErrNoDocuments:
		log.Println("no documents found", gameID)
		return "error"
	default:
		log.Println("unknown error", gameID)
		return "error"
	}

	return "drawn card"
}

func playCard(gameStore storage.Collection, gameID primitive.ObjectID, playerUsername string, cardName string) string {
	// Setup
	shortTimeoutContext, cancelUpdateGame := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancelUpdateGame()

	// Get the game to update
	activeGame, getGameErr := gameRepository.FindOne(gameStore, shortTimeoutContext, bson.M{"_id": gameID}) // Should have a projection too.
	if getGameErr != nil {
		log.Println("Couldn't get game", gameID.Hex(), getGameErr)
		return "error"
	}

	// Get card to play
	var activePlayer *models.Player
	for _, player := range activeGame.State.Players {
		if player.Name == playerUsername {
			activePlayer = &player
			break
		}
	}
	if activePlayer == nil {
		log.Println("Couldn't find player in game", playerUsername, gameID.Hex())
		return "error"
	}

	var cardToPlay *models.Card
	for _, card := range activePlayer.CardsInHand {
		if card.Name == cardName {
			cardToPlay = &card
			break
		}
	}
	if cardToPlay == nil {
		log.Println("Couldn't find card in player's hand", cardName, playerUsername, gameID.Hex())
		return "error"
	}

	// Remove from hand and put into play
	updateResult, updateError := gameRepository.Update(gameStore, shortTimeoutContext, bson.M{"_id": gameID}, bson.M{
		"$pull": &bson.M{
			"state.players.$[activePlayer].cardsInHand": &bson.M{
				"name": cardToPlay.Name,
			},
		},
		"$push": &bson.M{
			"state.players.$[activePlayer].cardsInPlay": bson.M{
				"name": &cardToPlay.Name,
				"type": &cardToPlay.Type,
			},
		},
	}, options.Update().SetArrayFilters(options.ArrayFilters{
		Filters: []interface{}{bson.M{"activePlayer.name": playerUsername}},
	}))

	switch updateError {
	case nil:
		log.Println("Updated game successfully", gameID, "with count", updateResult.ModifiedCount)
	case mongo.ErrNoDocuments:
		log.Println("no documents found", gameID)
		return "error"
	default:
		log.Println("unknown error", gameID)
		return "error"
	}

	// Return success
	return "played card"
}

func ready(gameStore storage.Collection, idToFetch primitive.ObjectID) string {
	initialCards := cards.GetCards()
	shortTimeoutContext, cancelUpdateGame := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancelUpdateGame()
	updateResult, updateError := gameRepository.Update(gameStore, shortTimeoutContext, bson.M{"_id": idToFetch}, bson.M{
		"$set": &bson.M{
			"state.cardsInDeck": initialCards,
		},
	}, &options.UpdateOptions{})
	switch updateError {
	case nil:
		log.Println("Updated game successfully", idToFetch, "with count", updateResult.ModifiedCount)
	}
	return "readied game"
}

func status() string {
	return "status fine"
}

type IncomingMessage struct {
	Message string                 `json:"message" bson:"message"`
	Body    map[string]interface{} `json:"body" bson:"body"`
	GameID  primitive.ObjectID     `json:"gameId" bson:"gameId"`
	UserID  string                 `json:"userId" bson:"userId"`
}

type PlayCardBody struct {
	CardName string `json:"cardName" bson:"cardName"`
}

// RouteIncomingMessage handles incoming websocket messages, and calls the appropriate function handlers.
func RouteIncomingMessage(message string, gameStore storage.Collection, idToFetch primitive.ObjectID, playerUsername string) (string, error) {
	var incomingMessage IncomingMessage
	json.Unmarshal([]byte(message), &incomingMessage)
	// Marshall the message specific payload, if any
	// This is simple, but not performant.
	// https://stackoverflow.com/a/54741880
	// The individual messages can unmarshall to the right type
	jsonbody, _ := json.Marshal(incomingMessage.Body)

	switch incomingMessage.Message {
	case "drawCard":
		drawCard(gameStore, idToFetch, playerUsername)
		return "success", nil
	case "playCard":
		var playCardBody PlayCardBody
		json.Unmarshal(jsonbody, &playCardBody)
		playCard(gameStore, idToFetch, playerUsername, playCardBody.CardName)
		return "success", nil
	case "ready":
		ready(gameStore, idToFetch)
		return "drawCard", nil
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
