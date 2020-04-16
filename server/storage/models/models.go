package storage

// Game representation in mongo collection
type Game struct {
	Name    string
	History []struct{}
	Config  struct{}
	State   State
}

// Player details, for example those within a game
type Player struct {
	Name string
	Age  int
	City string
}

// Card representation from the game
type Card struct {
	Name string
	Type string
}

// State of the game
type State struct {
	CardsInDeck []Card
	Players     []Player
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
