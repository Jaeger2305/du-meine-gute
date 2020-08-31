package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"math/rand"
	"time"

	gameRepository "github.com/Jaeger2305/du-meine-gute/repository"
	"github.com/Jaeger2305/du-meine-gute/storage"
	cards "github.com/Jaeger2305/du-meine-gute/storage/cards"
	models "github.com/Jaeger2305/du-meine-gute/storage/models"
	"github.com/gorilla/websocket"
	"github.com/segmentio/kafka-go"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type EndRoundBody struct {
	IsGameOver  bool   `json:"isGameOver" bson:"isGameOver"`
	WinnerName  string `json:"winnerName" bson:"winnerName"`
	ReadyPlayer string `json:"userId" bson:"userId"`
}

type GameReadyPayload struct {
	GameID        string         `json:"gameId" bson:"gameId"`
	IsReady       bool           `json:"isReady" bson:"isReady"`
	StartingCards []*models.Card `json:"startingCards" bson:"startingCards"`
	CardsInDeck   []*models.Card `json:"cardsInDeck" bson:"cardsInDeck"`
}

func gameStart(gameStore storage.Collection, gameID primitive.ObjectID, queueProducer *kafka.Writer) error {
	log.Println("Initialising", gameID.Hex(), "because all players are ready")
	// Initialise the game
	// Populate with the starting cards
	const startingCardCount = 5
	const playerCount = 1
	initialCards := cards.GetCards()
	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(initialCards), func(i, j int) { initialCards[i], initialCards[j] = initialCards[j], initialCards[i] })
	originalDeckCards := initialCards[startingCardCount:]

	shortTimeoutContext, cancelUpdateGame := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancelUpdateGame()
	updateResult, updateError := gameRepository.Update(gameStore, shortTimeoutContext, bson.M{"_id": gameID}, bson.M{
		"$set": &bson.M{
			"state.cardsInDeck":           originalDeckCards,
			"state.players.0.cardsInHand": initialCards[:startingCardCount],
		},
	}, &options.UpdateOptions{})
	switch updateError {
	case nil:
		log.Println("Updated game start status successfully", gameID.Hex(), "with count", updateResult.ModifiedCount)
	}

	var anonymisedDeckCards []*models.Card
	for _, card := range originalDeckCards {
		anonymisedCard := &models.Card{
			Name: "anonymous",
			Type: fmt.Sprintf("anonymous (%s)", card.Type),
		}
		anonymisedDeckCards = append(anonymisedDeckCards, anonymisedCard)
	}

	// Send message to communicate sucess
	payload := ServiceMessage{
		MessageType: "gameReady",
		Body: GameReadyPayload{
			GameID:        gameID.Hex(),
			IsReady:       true,
			StartingCards: initialCards[:startingCardCount],
			CardsInDeck:   anonymisedDeckCards,
		},
		Channel: gameID.Hex(),
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

// RouteQueueRequest handles outgoing websocket messages made by Kafka, and calls the appropriate function handlers.
func RouteQueueRequest(message ServiceMessage, gameStore storage.Collection) ([]ServiceMessage, error) {
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
			Channel:     message.Channel,
		}
		return append(outgoingMessages, outgoingClientMessage), nil
	case "gameReady":
		var gameReadyParams GameReadyPayload
		if parseGameReadyErr := json.Unmarshal(jsonbody, &gameReadyParams); parseGameReadyErr != nil {
			log.Printf("Couldn't parse payload for game ready from message body %v", parseGameReadyErr)
		}
		outgoingClientMessage := ServiceMessage{
			MessageType: message.MessageType,
			Body:        message.Body,
			Channel:     message.Channel,
		}

		return append(outgoingMessages, outgoingClientMessage), nil
	case "drawCard":
		var drawCardParams RequestDrawCardPayload
		if parseDrawCardErr := json.Unmarshal(jsonbody, &drawCardParams); parseDrawCardErr != nil {
			log.Printf("Couldn't parse payload for draw card from message body %v", parseDrawCardErr)
			return outgoingMessages, fmt.Errorf("Couldn't parse payload for draw card from message body %v", parseDrawCardErr)
		}
		card, drawCardErr := drawCard(gameStore, drawCardParams.GameID, drawCardParams.UserID)

		if drawCardErr != nil {
			return outgoingMessages, fmt.Errorf("Couldn't draw card: %v", drawCardErr)
		}

		outgoingClientMessage := ServiceMessage{
			MessageType: message.MessageType,
			Body:        card,
			Channel:     message.Channel,
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
			Channel:     message.Channel,
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
			Channel: message.Channel,
		}

		return append(outgoingMessages, outgoingClientMessage), nil
	}
	return outgoingMessages, fmt.Errorf("Unrecognised message type for outgoing message %s", message.MessageType)
}

func monitorServerMessageQueue(queueConsumer *kafka.Reader, channelClients *map[string](map[primitive.ObjectID]websocketClient), gameStore storage.Collection) {
	for {
		// Get the raw message
		// Could probably be better as a Fetch and Commit message, but it's not clear if this takes a lock to prevent other servers from picking it up.
		// https://github.com/segmentio/kafka-go#explicit-commits
		m, messageQueueReadErr := queueConsumer.ReadMessage(context.Background())
		if messageQueueReadErr != nil {
			log.Printf("error while receiving message: %v", messageQueueReadErr)
			continue
		}
		log.Printf("message at topic/partition/offset %v/%v/%v: %s", m.Topic, m.Partition, m.Offset, string(m.Value))

		// Unmarshal to a JSON message
		var parsedServerMessage ServiceMessage
		if parseServerMessageErr := json.Unmarshal(m.Value, &parsedServerMessage); parseServerMessageErr != nil {
			log.Printf("Couldn't parse server message from kafka %v", parseServerMessageErr)
		}

		outgoingMessages, routeOutgoingMessageErr := RouteQueueRequest(parsedServerMessage, gameStore)
		if routeOutgoingMessageErr != nil {
			log.Printf("Couldn't handle the outgoing message router: %v", routeOutgoingMessageErr)
		}
		for _, outgoingMessage := range outgoingMessages {
			// If the message isn't relevant for this connection, skip it.
			log.Println("Currently, all messages are sent to the connection, regardless of origin! TODO.")

			// Serialise the message for transport over websocket
			serialisedOutgoingMessage, serialiseErr := json.Marshal(outgoingMessage)
			if serialiseErr != nil {
				log.Printf("Couldn't serialise message: %v.", serialiseErr)
				return
			}

			// Send the message through all the websocket connections connected to this channel on this server instance
			clientsForChannel := (*channelClients)[outgoingMessage.Channel]
			for connectionID, client := range clientsForChannel {
				if writeWebsocketMessageErr := client.connection.WriteMessage(websocket.TextMessage, serialisedOutgoingMessage); writeWebsocketMessageErr != nil {
					log.Printf("Couldn't write to the websocket %s - it might be have dropped from the client or server side. Intended message: %s error: %v", connectionID.Hex(), serialisedOutgoingMessage, writeWebsocketMessageErr)
				}
			}
		}
	}
}
