package handlers

import (
	"fmt"
	"testing"
)

func TestRouteIncomingMessage(t *testing.T) {

	messageTests := []struct {
		name string
		want string
	}{
		{"playCard", "success"},
		{"drawCard", "success"},
		{"ready", "success"},
		{"status", "success"},
	}

	for _, messageConfig := range messageTests {
		t.Run(fmt.Sprintf("a %v message returns successfully", messageConfig.name), func(t *testing.T) {
			got, err := RouteIncomingMessage(messageConfig.name)
			if err != nil {
				t.Errorf("routing failed: %v", err)
			}
			if got != messageConfig.want {
				t.Errorf("got %v but expected %v", got, messageConfig.want)
			}
		})
	}

	t.Run("an unrecognised message returns an error", func(t *testing.T) {
		_, err := RouteIncomingMessage("unrecognised")
		if err == nil {
			t.Fatal("we were expecting an error for this unrecognised message")
		}
	})

}

func TestDrawCard(t *testing.T) {
	got := drawCard()
	want := "drawn card"
	if got != want {
		t.Errorf("got %v but wanted %v", got, want)
	}
}

func TestPlayCard(t *testing.T) {
	got := playCard()
	want := "played card"
	if got != want {
		t.Errorf("got %v but wanted %v", got, want)
	}
}

func TestReady(t *testing.T) {
	got := ready()
	want := "readied game"
	if got != want {
		t.Errorf("got %v but wanted %v", got, want)
	}
}

func TestStatus(t *testing.T) {
	got := status()
	want := "status fine"
	if got != want {
		t.Errorf("got %v but wanted %v", got, want)
	}
}
