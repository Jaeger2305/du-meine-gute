package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"time"

	gameRepository "github.com/Jaeger2305/du-meine-gute/repository"
	"github.com/Jaeger2305/du-meine-gute/storage"
	cards "github.com/Jaeger2305/du-meine-gute/storage/cards"
	models "github.com/Jaeger2305/du-meine-gute/storage/models"
	"github.com/segmentio/kafka-go"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

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

func drawCard(gameStore storage.Collection, gameID string, playerUsername string) (models.Card, error) {
	shortTimeoutContext, cancelUpdateGame := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancelUpdateGame()
	gameObjectID, objectIDConversionErr := primitive.ObjectIDFromHex(gameID)
	if objectIDConversionErr != nil {
		return models.Card{}, fmt.Errorf("Couldn't convert %s game ID to a valid object ID: %v", gameID, objectIDConversionErr)
	}
	activeGame, getGameErr := gameRepository.FindOne(gameStore, shortTimeoutContext, bson.M{"_id": gameObjectID}) // Should have a projection too.
	if getGameErr != nil {
		return models.Card{}, fmt.Errorf("Couldn't get game %s: %v", gameID, getGameErr)
	}

	// Get the card
	cardsInDeck := activeGame.State.CardsInDeck
	if len(cardsInDeck) == 0 {
		// This isn't really a server error, it should actually generate another message which tells the user something failed.
		return models.Card{}, fmt.Errorf("there are no cards left in the deck %s", gameID)
	}
	cardToDraw := cardsInDeck[0]

	// Update the state
	updateResult, updateError := gameRepository.Update(gameStore, shortTimeoutContext, bson.M{"_id": gameObjectID}, bson.M{
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
		log.Println("Updated player hand and deck in game", gameID, "with game modified count", updateResult.ModifiedCount)
	case mongo.ErrNoDocuments:
		return cardToDraw, fmt.Errorf("no documents found %s", gameID)
	default:
		return cardToDraw, fmt.Errorf("unknown error %v", updateError)
	}

	return cardToDraw, nil
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

func playCard(gameStore storage.Collection, gameID string, playerUsername string, cardName string) (*models.Card, error) {
	// Setup
	shortTimeoutContext, cancelUpdateGame := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancelUpdateGame()

	gameObjectID, objectIDConversionErr := primitive.ObjectIDFromHex(gameID)
	if objectIDConversionErr != nil {
		return &models.Card{}, fmt.Errorf("Couldn't convert %s game ID to a valid object ID: %v", gameID, objectIDConversionErr)
	}

	// Get the game to update
	activeGame, getGameErr := gameRepository.FindOne(gameStore, shortTimeoutContext, bson.M{"_id": gameObjectID}) // Should have a projection too.
	if getGameErr != nil {
		return &models.Card{}, fmt.Errorf("Couldn't get game %s: %v", gameID, getGameErr)
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
		return &models.Card{}, fmt.Errorf("Couldn't find player %s in game %s", playerUsername, gameID)
	}

	var cardToPlay *models.Card
	for _, card := range activePlayer.CardsInHand {
		if card.Name == cardName {
			cardToPlay = &card
			break
		}
	}
	if cardToPlay == nil {
		return cardToPlay, fmt.Errorf("Couldn't find card %s in %s hand for game %s", cardName, playerUsername, gameID)
	}

	// Remove from hand and put into play
	updateResult, updateError := gameRepository.Update(gameStore, shortTimeoutContext, bson.M{"_id": gameObjectID}, bson.M{
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
		return cardToPlay, fmt.Errorf("no documents found %s", gameID)
	default:
		return cardToPlay, fmt.Errorf("unknown error %s", gameID)
	}

	// Return success
	return cardToPlay, nil
}

type RequestDrawCardPayload struct {
	GameID string `json:"gameId" bson:"gameId"`
	UserID string `json:"userId" bson:"userId"`
}

type RequestPlayCardPayload struct {
	GameID string `json:"gameId" bson:"gameId"`
	UserID string `json:"userId" bson:"userId"`
	CardID string `json:"cardId" bson:"cardId"`
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

type EndRoundBody struct {
	IsGameOver  bool   `json:"isGameOver" bson:"isGameOver"`
	WinnerName  string `json:"winnerName" bson:"winnerName"`
	ReadyPlayer string `json:"userId" bson:"userId"`
}

type GameReadyPayload struct {
	GameID  string `json:"gameId" bson:"gameId"`
	IsReady bool   `json:"isReady" bson:"isReady"`
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
		return fmt.Errorf("couldn't write to kafka for message: , error: %v", messageForQueue, writeKafkaMessageErr)
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

func gameStart(gameStore storage.Collection, gameID primitive.ObjectID, queueProducer *kafka.Writer) error {
	log.Println("Initialising", gameID.Hex(), "because all players are ready")
	// Initialise the game
	// Populate with the starting cards
	initialCards := cards.GetCards()
	shortTimeoutContext, cancelUpdateGame := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancelUpdateGame()
	updateResult, updateError := gameRepository.Update(gameStore, shortTimeoutContext, bson.M{"_id": gameID}, bson.M{
		"$set": &bson.M{
			"state.cardsInDeck": initialCards,
		},
	}, &options.UpdateOptions{})
	switch updateError {
	case nil:
		log.Println("Updated game start status successfully", gameID.Hex(), "with count", updateResult.ModifiedCount)
	}

	// Send message to communicate sucess
	payload := ServiceMessage{
		MessageType: "gameReady",
		Body: GameReadyPayload{
			GameID:  gameID.Hex(),
			IsReady: true,
		},
	}
	messageForQueue, stringifyErr := json.Marshal(payload)
	if stringifyErr != nil {
		return fmt.Errorf("Couldn't stringify game ready message: %v", stringifyErr)
	}

	kafkaMessage := kafka.Message{
		Key:   nil, // for partitions, but not using that
		Value: messageForQueue,
		Time:  time.Now(),
	}

	writeKafkaMessageErr := queueProducer.WriteMessages(context.Background(), kafkaMessage)
	return writeKafkaMessageErr
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

func endRound(gameStore storage.Collection, gameID string) (bool, string, error) {
	shortTimeoutContext, cancelUpdateGame := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancelUpdateGame()

	gameObjectID, objectIDConversionErr := primitive.ObjectIDFromHex(gameID)
	if objectIDConversionErr != nil {
		return false, "", fmt.Errorf("Couldn't convert %s game ID to a valid object ID: %v", gameID, objectIDConversionErr)
	}

	// Check if all users are ready to end the round.
	log.Println("Single player version - no check for other player choice to end the round.")

	// Check if the game has finished
	activeGame, getGameErr := gameRepository.FindOne(gameStore, shortTimeoutContext, bson.M{"_id": gameObjectID}) // Should have a projection too.
	if getGameErr != nil {
		log.Println("Couldn't get game", gameID, getGameErr)
		return false, "", errors.New("error")
	}
	var isGameOver bool
	var winningPlayer string
	for _, player := range activeGame.State.Players {
		if len(player.CardsInPlay) >= 8 {
			isGameOver = true
			winningPlayer = player.Name
		}
	}

	if winningPlayer != "" {
		// Update game state
		updateResult, updateError := gameRepository.Update(gameStore, shortTimeoutContext, bson.M{"_id": gameObjectID}, bson.M{
			"$set": &bson.M{
				"state.winner": winningPlayer,
			},
		}, &options.UpdateOptions{})
		switch updateError {
		case nil:
			log.Printf("Updated game %s winner %s with count %d", gameID, winningPlayer, updateResult.ModifiedCount)
		default:
			log.Printf("Error when updating game %s winner %s: %v", gameID, winningPlayer, updateError)
			return isGameOver, winningPlayer, updateError
		}

	}

	return isGameOver, winningPlayer, nil
}

func status() string {
	return "status fine"
}

// We can marshal to a known type after initially marshalling the message type
// This is a custom implementation to help route the messages from kafka, applying to all messages from the "game" topic
type ServiceMessage struct {
	MessageType string      `json:"messageType" bson:"messageType"`
	Body        interface{} `json:"body" bson:"body"`
}

type PlayCardBody struct {
	CardName string `json:"cardName" bson:"cardName"`
}

// RouteIncomingMessage handles incoming websocket messages, and calls the appropriate function handlers.
func RouteIncomingMessage(message string, gameStore storage.Collection, idToFetch primitive.ObjectID, playerUsername string, queueProducer *kafka.Writer) error {

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
	case "status":
		status()
		break
	default:
		return fmt.Errorf("Message not understood %v", message)
	}

	return nil
}

// RouteOutgoingMessage handles outgoing websocket messages, and calls the appropriate function handlers.
func RouteOutgoingMessage(message ServiceMessage, gameStore storage.Collection) ([]ServiceMessage, error) {
	outgoingMessages := make([]ServiceMessage, 0)
	// Marshall the message specific payload, if any
	// This is simple, but not performant.
	// https://stackoverflow.com/a/54741880
	// The individual messages can unmarshall to the right type
	// Currently nothing is being done with the payload response, so just commented out for now.
	// This matches the structure for the incoming message
	jsonbody, marshalErr := json.Marshal(message.Body)
	if marshalErr != nil {
		return outgoingMessages, fmt.Errorf("Couldn't marshal message body: %v, %v", message.Body, marshalErr)
	}

	switch message.MessageType {
	case "playerReady":
		outgoingClientMessage := ServiceMessage{
			MessageType: message.MessageType,
			Body:        message.Body,
		}
		return append(outgoingMessages, outgoingClientMessage), nil
	case "gameReady":
		outgoingClientMessage := ServiceMessage{
			MessageType: message.MessageType,
			Body:        message.Body,
		}

		return append(outgoingMessages, outgoingClientMessage), nil
	case "drawCard":
		var drawCardParams RequestDrawCardPayload
		if parseDrawCardErr := json.Unmarshal(jsonbody, &drawCardParams); parseDrawCardErr != nil {
			log.Printf("Couldn't parse payload for draw card from message body %v", parseDrawCardErr)
		}
		card, drawCardErr := drawCard(gameStore, drawCardParams.GameID, drawCardParams.UserID)

		if drawCardErr != nil {
			return outgoingMessages, fmt.Errorf("Couldn't draw card: %v", drawCardErr)
		}

		outgoingClientMessage := ServiceMessage{
			MessageType: message.MessageType,
			Body:        card,
		}

		return append(outgoingMessages, outgoingClientMessage), nil
	case "playCard":
		var playCardParams RequestPlayCardPayload
		if parsePlayCardErr := json.Unmarshal(jsonbody, &playCardParams); parsePlayCardErr != nil {
			log.Printf("Couldn't parse payload for play card from message body %v", parsePlayCardErr)
		}
		card, playCardErr := playCard(gameStore, playCardParams.GameID, playCardParams.UserID, playCardParams.CardID)

		if playCardErr != nil {
			return outgoingMessages, fmt.Errorf("Couldn't play card %s: %v", playCardParams.CardID, playCardErr)
		}

		outgoingClientMessage := ServiceMessage{
			MessageType: message.MessageType,
			Body:        card,
		}

		return append(outgoingMessages, outgoingClientMessage), nil
	case "playerEndRound":
		var playerEndRoundParams PlayerEndRoundPayload
		if parsePlayerEndRoundErr := json.Unmarshal(jsonbody, &playerEndRoundParams); parsePlayerEndRoundErr != nil {
			log.Printf("Couldn't parse payload for player end round from message body %v", parsePlayerEndRoundErr)
		}
		isGameOver, winnerName, endRoundError := endRound(gameStore, playerEndRoundParams.GameID)

		if endRoundError != nil {
			return outgoingMessages, fmt.Errorf("Couldn't end round: %v", endRoundError)
		}

		outgoingClientMessage := ServiceMessage{
			MessageType: message.MessageType,
			Body: EndRoundBody{
				IsGameOver:  isGameOver,
				WinnerName:  winnerName,
				ReadyPlayer: playerEndRoundParams.UserID,
			},
		}

		return append(outgoingMessages, outgoingClientMessage), nil
	}
	return outgoingMessages, fmt.Errorf("Unrecognised message type for outgoing message %s", message.MessageType)
}
