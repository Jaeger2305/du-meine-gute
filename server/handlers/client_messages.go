package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	gameRepository "github.com/Jaeger2305/du-meine-gute/repository"
	"github.com/Jaeger2305/du-meine-gute/storage"
	models "github.com/Jaeger2305/du-meine-gute/storage/models"
	"github.com/gorilla/websocket"
	"github.com/segmentio/kafka-go"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type RequestDrawCardPayload struct {
	GameID string `json:"gameId" bson:"gameId"`
	UserID string `json:"userId" bson:"userId"`
}

type RequestPlayCardPayload struct {
	GameID string `json:"gameId" bson:"gameId"`
	UserID string `json:"userId" bson:"userId"`
	CardID string `json:"cardId" bson:"cardId"`
}

type PlayCardBody struct {
	CardName string `json:"cardName" bson:"cardName"`
}

type PlayerReadyPayload struct {
	GameID  string `json:"gameId" bson:"gameId"`
	UserID  string `json:"userId" bson:"userId"`
	IsReady bool   `json:"isReady" bson:"isReady"`
}

type PlayerEndRoundPayload struct {
	GameID string `json:"gameId" bson:"gameId"`
	UserID string `json:"userId" bson:"userId"`
}

// RouteClientRequest handles incoming websocket messages, and calls the appropriate function handlers.
func RouteClientRequest(message string, gameStore storage.Collection, idToFetch primitive.ObjectID, playerUsername string, queueProducer *kafka.Writer) error {

	var incomingMessage ServiceMessage
	json.Unmarshal([]byte(message), &incomingMessage)
	// Marshall the message specific payload, if any
	// This is simple, but not performant.
	// https://stackoverflow.com/a/54741880
	// The individual messages can unmarshall to the right type
	jsonbody, _ := json.Marshal(incomingMessage.Body)

	switch incomingMessage.MessageType {
	case "requestDrawCard":
		return requestDrawCard(gameStore, idToFetch, playerUsername, queueProducer)
	case "requestPlayCard":
		var playCardBody PlayCardBody
		json.Unmarshal(jsonbody, &playCardBody)
		return requestPlayCard(gameStore, idToFetch, playerUsername, playCardBody.CardName, queueProducer)
	case "playerEndRound":
		return playerEndRound(gameStore, idToFetch, playerUsername, queueProducer) // Only single player mode for MVP.
	case "playerReady":
		return playerReady(gameStore, idToFetch, playerUsername, queueProducer)
	default:
		return fmt.Errorf("Message not understood %v", message)
	}

	return nil
}

func playerReady(gameStore storage.Collection, gameID primitive.ObjectID, playerUsername string, queueProducer *kafka.Writer) error {
	shortTimeoutContext, cancelPlayerReady := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancelPlayerReady()

	// Update player status in the game
	updateResult, updateError := gameRepository.Update(gameStore, shortTimeoutContext, bson.M{"_id": gameID}, bson.M{
		"$set": &bson.M{
			"state.players.$[activePlayer].isReady": true,
		},
	}, options.Update().SetArrayFilters(options.ArrayFilters{
		Filters: []interface{}{bson.M{"activePlayer.name": playerUsername}},
	}))
	if updateError != nil {
		return fmt.Errorf("Couldn't set player status: %v", updateError)
	}
	log.Println("Updated player ready status successfully", gameID.Hex(), "with count", updateResult.ModifiedCount)

	// Send message to queue
	payload := ServiceMessage{
		MessageType: "playerReady",
		Body: PlayerReadyPayload{
			GameID:  gameID.Hex(),
			UserID:  playerUsername,
			IsReady: true,
		},
		Channel: gameID.Hex(),
	}
	messageForQueue, stringifyErr := json.Marshal(payload)
	if stringifyErr != nil {
		return fmt.Errorf("Couldn't stringify player ready message: %v", stringifyErr)
	}

	log.Printf("Sending message to Kafka: %s", string(messageForQueue))
	writeKafkaMessageErr := queueProducer.WriteMessages(shortTimeoutContext, kafka.Message{
		Key:   nil, // for partitions, but not using that
		Value: messageForQueue,
		Time:  time.Now(),
	})
	if writeKafkaMessageErr != nil {
		return fmt.Errorf("couldn't write to kafka for message: %s, error: %v", string(messageForQueue), writeKafkaMessageErr)
	}

	// If all players are ready, send another message which starts the game.
	// This logic could be built out to allow paused/disconnected/waiting functionality, but for single player this is fine.
	// Also pretty inefficient to keep retrieving the game every time.
	activeGame, getGameErr := gameRepository.FindOne(gameStore, shortTimeoutContext, bson.M{"_id": gameID}) // Should have a projection too.
	if getGameErr != nil {
		return fmt.Errorf("Couldn't get game %s: %v", gameID.Hex(), getGameErr)
	}
	isEveryoneReady := true
	for _, player := range activeGame.State.Players {
		if player.IsReady == false {
			isEveryoneReady = false
		}
	}
	if isEveryoneReady {
		return gameStart(gameStore, gameID, queueProducer)
	}
	return nil
}

func playerEndRound(gameStore storage.Collection, gameID primitive.ObjectID, playerUsername string, queueProducer *kafka.Writer) error {
	shortTimeoutContext, cancelUpdateGame := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancelUpdateGame()

	// Send message to queue
	payload := ServiceMessage{
		MessageType: "playerEndRound",
		Body: PlayerEndRoundPayload{
			GameID: gameID.Hex(),
			UserID: playerUsername,
		},
		Channel: gameID.Hex(),
	}
	messageForQueue, stringifyErr := json.Marshal(payload)
	if stringifyErr != nil {
		return fmt.Errorf("Couldn't stringify player end round message: %v", stringifyErr)
	}

	log.Printf("Sending message to Kafka: %s", string(messageForQueue))
	writeKafkaMessageErr := queueProducer.WriteMessages(shortTimeoutContext, kafka.Message{
		Key:   nil, // for partitions, but not using that
		Value: messageForQueue,
		Time:  time.Now(),
	})
	if writeKafkaMessageErr != nil {
		return fmt.Errorf("couldn't write to kafka for message: , error: %v", messageForQueue, writeKafkaMessageErr)
	}
	return nil
}

func requestPlayCard(gameStore storage.Collection, gameID primitive.ObjectID, playerUsername string, cardName string, queueProducer *kafka.Writer) error {
	// Setup
	shortTimeoutContext, cancelUpdateGame := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancelUpdateGame()

	// Validate they can draw by checking the state of the game
	log.Println("TODO: This doesn't cover all scenarios")

	// Get the game to update
	activeGame, getGameErr := gameRepository.FindOne(gameStore, shortTimeoutContext, bson.M{"_id": gameID}) // Should have a projection too.
	if getGameErr != nil {
		return fmt.Errorf("Couldn't get game %s: %v", gameID.Hex(), getGameErr)
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
		return fmt.Errorf("Couldn't find player %s in game %s", playerUsername, gameID.Hex())
	}

	var cardToPlay *models.Card
	for _, card := range activePlayer.CardsInHand {
		if card.Name == cardName {
			cardToPlay = &card
			break
		}
	}
	if cardToPlay == nil {
		return fmt.Errorf("Couldn't find card %s in %s hand for game %s", cardName, playerUsername, gameID.Hex())
	}

	// Write request to message queue
	payload := ServiceMessage{
		MessageType: "playCard",
		Body: RequestPlayCardPayload{
			GameID: gameID.Hex(),
			UserID: playerUsername,
			CardID: cardToPlay.Name,
		},
		Channel: gameID.Hex(),
	}
	messageForQueue, stringifyErr := json.Marshal(payload)
	if stringifyErr != nil {
		return fmt.Errorf("Couldn't stringify request play card message: %v", stringifyErr)
	}

	log.Printf("Sending message to Kafka: %s", string(messageForQueue))
	writeKafkaMessageErr := queueProducer.WriteMessages(shortTimeoutContext, kafka.Message{
		Key:   nil, // for partitions, but not using that
		Value: messageForQueue,
		Time:  time.Now(),
	})
	if writeKafkaMessageErr != nil {
		return fmt.Errorf("couldn't write to kafka for message: , error: %v", messageForQueue, writeKafkaMessageErr)
	}
	// Return success
	return nil
}

func requestDrawCard(gameStore storage.Collection, gameID primitive.ObjectID, playerUsername string, queueProducer *kafka.Writer) error {
	shortTimeoutContext, cancelRequest := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancelRequest()

	// Validate they can draw by checking the state of the game
	log.Println("TODO: No validation is done on whether a player is permitted to draw a card")

	// Write request to message queue
	payload := ServiceMessage{
		MessageType: "drawCard",
		Body: RequestDrawCardPayload{
			GameID: gameID.Hex(),
			UserID: playerUsername,
		},
		Channel: gameID.Hex(),
	}
	messageForQueue, stringifyErr := json.Marshal(payload)
	if stringifyErr != nil {
		return fmt.Errorf("Couldn't stringify request draw card message: %v", stringifyErr)
	}

	log.Printf("Sending message to Kafka: %s", string(messageForQueue))
	writeKafkaMessageErr := queueProducer.WriteMessages(shortTimeoutContext, kafka.Message{
		Key:   nil, // for partitions, but not using that
		Value: messageForQueue,
		Time:  time.Now(),
	})
	if writeKafkaMessageErr != nil {
		return fmt.Errorf("couldn't write to kafka for message: , error: %v", messageForQueue, writeKafkaMessageErr)
	}
	return nil
}

func monitorClientMessageQueue(gameStore storage.Collection, connection *websocket.Conn, queueProducer *kafka.Writer, idToFetch primitive.ObjectID, playerUsername string) {
	for {
		_, clientMessage, readClientMessageErr := connection.ReadMessage()
		if readClientMessageErr != nil {
			log.Printf("Couldn't read client message when monitoring the websocket connection: %v", readClientMessageErr)
			return
		}
		log.Println(string(clientMessage))

		routeIncomingMessageErr := RouteClientRequest(string(clientMessage), gameStore, idToFetch, playerUsername, queueProducer)
		if routeIncomingMessageErr != nil {
			log.Printf("Failed to work out what to do with the incoming message: %v", routeIncomingMessageErr)
		}
	}
}
