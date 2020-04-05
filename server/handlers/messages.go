package handlers

import (
	"fmt"
)

func drawCard() string {
	return "drawn card"
}

func playCard() string {
	return "played card"
}

func ready() string {
	return "readied game"
}

func status() string {
	return "status fine"
}

// RouteIncomingMessage handles incoming websocket messages, and calls the appropriate function handlers.
func RouteIncomingMessage(message string) (string, error) {
	switch message {
	case "drawCard":
		drawCard()
		return "success", nil
	case "playCard":
		playCard()
		return "success", nil
	case "ready":
		ready()
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
	}
	return 1, "", nil
}
