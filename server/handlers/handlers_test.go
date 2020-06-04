package handlers

import (
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"github.com/stretchr/testify/mock"

	"github.com/Jaeger2305/du-meine-gute/mocks"
	"github.com/Jaeger2305/du-meine-gute/storage"
	models "github.com/Jaeger2305/du-meine-gute/storage/models"
	"github.com/go-chi/chi"
	"github.com/gorilla/websocket"
)

// TestServeFiles returns the index.html
// This is fragile, and will be refactored when we set up Vue clientside
func TestServeFiles(t *testing.T) {
	req, err := http.NewRequest("GET", "/", nil)
	if err != nil {
		t.Fatal(err)
	}
	res := httptest.NewRecorder()
	os.Chdir("..") // Go doesn't handle working directory differences for tests very well.
	// https://stackoverflow.com/questions/23847003/golang-tests-and-working-directory
	handler := http.HandlerFunc(ServeFiles)
	handler.ServeHTTP(res, req)
	if res.Code != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			res.Code, http.StatusOK)
	}
	expected := `<html>
  <head></head>
  <body>
    <h1>Du Meine Güte</h1>
    <form action="/games/join" method="post">
      <button type="submit">Join game</button>
    </form>
    <input id="message-detail">Send message</input>
    <button id="send-message">Send message</button>
    <script>
      // Create WebSocket connection.
      const socket = new WebSocket('ws://localhost:4444/games/live');

      // Connection opened
      socket.addEventListener('open', function (event) {
          socket.send('status');
      });

      // Listen for messages
      socket.addEventListener('message', function (event) {
          console.log('Message from server ', event.data);
      });

      const messageDetailButton = document.getElementById('message-detail');
      const sendMessageButton = document.getElementById('send-message');
      sendMessageButton.addEventListener('click', () => {
        socket.send(messageDetailButton.value)
      });
    </script>
  </body>
</html>`
	if res.Body.String() != expected {
		t.Errorf("handler returned unexpected body: got %v want %v",
			res.Body.String(), expected)
	}
}

// TestJoinGame returns the game thats been joined
func TestJoinGame(t *testing.T) {
	req, err := http.NewRequest("POST", "/games/join", nil)
	if err != nil {
		t.Fatal(err)
	}

	res := httptest.NewRecorder()
	handler := http.HandlerFunc(JoinGame)
	handler.ServeHTTP(res, req)

	if res.Code != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			res.Code, http.StatusOK)
	}

	expected := `{"name":"test-game-1"}` + "\n"
	if res.Body.String() != expected {
		t.Errorf("handler returned unexpected body: got %v want %v",
			res.Body.String(), expected)
	}
}

var mockClient storage.ClientHelper
var mockDb storage.DatabaseHelper
var mockCollection storage.CollectionHelper
var srHelperExample storage.SingleResultHelper

func TestGetGames(t *testing.T) {
	// Because we're not using an object and accessing its methods, the whole structure needs to be mocked at the moment.
	mockClient = &mocks.MongoClient{}
	mockDb = &mocks.MockDatabase{}
	mockCollection = &mocks.CollectionHelper{}
	srHelperExample = &mocks.SingleResultHelper{}
	mockDb.(*mocks.MockDatabase).Db.
		On("Collection", "games").Return(mockCollection)
	mockClient.(*mocks.MongoClient).
		On("Database", "du-meine-gute").Return(mockDb)
	mockCollection.(*mocks.CollectionHelper).
		On("FindOne", mock.Anything, mock.Anything).
		Return(srHelperExample)
	srHelperExample.(*mocks.SingleResultHelper).
		On("Decode", mock.AnythingOfType("*storage.Test")).
		Return(nil).
		Run(func(args mock.Arguments) {
			arg := args.Get(0).(*models.Test)
			arg.Name = "test-game-1"
		})
	// srHelperExample.(*mocks.SingleResultHelper).
	// 	On("Decode", mock.AnythingOfType("*storage.Test")).
	// 	Return(nil).
	// 	Run(func(args mock.Arguments) {
	// 		arg := args.Get(0).(*models.Test)
	// 		arg.Name = "test-game-2"
	// 	})

	req, err := http.NewRequest("GET", "/games", nil)
	if err != nil {
		t.Fatal(err)
	}

	res := httptest.NewRecorder()
	handler := GetGames(mockClient)
	handler.ServeHTTP(res, req)

	if res.Code != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			res.Code, http.StatusOK)
	}

	expected := `[{"Name":"test-game-1","State":{"Name":"","Type":""}}]` + "\n"
	if res.Body.String() != expected {
		t.Errorf("handler returned unexpected body: got %v want %v",
			res.Body.String(), expected)
	}
}

func TestGetStatus(t *testing.T) {
	req, err := http.NewRequest("GET", "/status", nil)
	if err != nil {
		t.Fatal(err)
	}

	res := httptest.NewRecorder()
	handler := http.HandlerFunc(GetStatus)
	handler.ServeHTTP(res, req)

	if res.Code != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			res.Code, http.StatusOK)
	}

	expected := `{"alive": true}`
	if res.Body.String() != expected {
		t.Errorf("handler returned unexpected body: got %v want %v",
			res.Body.String(), expected)
	}
}

func TestGetLive(t *testing.T) {
	router := chi.NewRouter()
	router.Get("/games/live", GetLive)
	server := httptest.NewServer(router)
	defer server.Close()

	wsURL := "ws" + strings.TrimPrefix(server.URL, "http") + "/games/live"

	ws, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("could not open a ws connection on %s %v", wsURL, err)
	}
	defer ws.Close()

	if err := ws.WriteMessage(websocket.TextMessage, []byte("success")); err != nil {
		t.Fatalf("could not send message over ws connection %v", err)
	}
}
