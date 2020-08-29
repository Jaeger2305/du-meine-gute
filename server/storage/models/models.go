package storage

import "go.mongodb.org/mongo-driver/bson/primitive"

// Game representation in mongo collection
type Game struct {
	ID      primitive.ObjectID `json:"_id" bson:"_id"`
	Name    string             `json:"name" bson:"name"`
	History []struct{}         `json:"history" bson:"history"`
	Config  struct{}           `json:"config" bson:"config"`
	State   State              `json:"state" bson:"state"`
}

// Player details, for example those within a game
type Player struct {
	Name        string `json:"name" bson:"name"`
	Age         int    `json:"age" bson:"age"`
	City        string `json:"city" bson:"city"`
	IsReady     bool   `json:"isReady" bson:"isReady"`
	CardsInHand []Card `json:"cardsInHand" bson:"cardsInHand"`
	CardsInPlay []Card `json:"cardsInPlay" bson:"cardsInPlay"`
}

// Card representation from the game
type Card struct {
	Name string `json:"name" bson:"name"`
	Type string `json:"type" bson:"type"`
}

// State of the game
type State struct {
	Winner      string   `json:"winner" bson:"winner"`
	CardsInDeck []Card   `json:"cardsInDeck" bson:"cardsInDeck"`
	Players     []Player `json:"players" bson:"players"`
}

type Simple struct {
	Name  string
	State Card
}

type Test struct {
	Name  string
	State struct {
		Name string
		Type string
	}
}
