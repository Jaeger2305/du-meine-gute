package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/Jaeger2305/du-meine-gute/errors"
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

var mockClient storage.Client
var mockDb storage.Database
var mockCollection storage.Collection
var srHelperExample storage.SingleResult

func TestGetGames(t *testing.T) {
	// Because we're not using an object and accessing its methods, the whole structure needs to be mocked at the moment.
	mockClient = &mocks.MockClient{}
	mockDb = &mocks.MockDatabase{}
	mockCollection = &mocks.MockCollection{}
	srHelperExample = &mocks.MockSingleResult{}
	mockDb.(*mocks.MockDatabase).Db.
		On("Collection", "games").Return(mockCollection)
	mockClient.(*mocks.MockClient).
		On("Database", "du-meine-gute").Return(mockDb)
	mockCollection.(*mocks.MockCollection).
		On("FindOne", mock.Anything, mock.Anything).
		Return(srHelperExample)
	srHelperExample.(*mocks.MockSingleResult).
		On("Decode", mock.AnythingOfType("*storage.Game")).
		Return(nil).
		Run(func(args mock.Arguments) {
			arg := args.Get(0).(*models.Game)
			arg.Name = "test-game-1"
		})
	// srHelperExample.(*mocks.MockSingleResult).
	// 	On("Decode", mock.AnythingOfType("*storage.Game")).
	// 	Return(nil).
	// 	Run(func(args mock.Arguments) {
	// 		arg := args.Get(0).(*models.Game)
	// 		arg.Name = "test-game-2"
	// 	})

	req, err := http.NewRequest("GET", "/game", nil)
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
	expectedObj, _ := json.Marshal(&models.Game{Name: "test-game-1"})
	expected := "[" + string(expectedObj) + "]\n"
	if res.Body.String() != expected {
		t.Errorf("handler returned unexpected body: got %v want %v",
			res.Body.String(), expected)
	}
}

func TestGetGame(t *testing.T) {
	stringID := "5ed91ed202c719f3f43e23af"
	idToFetch, _ := primitive.ObjectIDFromHex(stringID)
	// Because we're not using an object and accessing its methods, the whole structure needs to be mocked at the moment.
	mockClient = &mocks.MockClient{}
	mockDb = &mocks.MockDatabase{}
	mockCollection = &mocks.MockCollection{}
	srHelperExample = &mocks.MockSingleResult{}
	mockDb.(*mocks.MockDatabase).Db.
		On("Collection", "games").Return(mockCollection)
	mockClient.(*mocks.MockClient).
		On("Database", "du-meine-gute").Return(mockDb)
	mockCollection.(*mocks.MockCollection).
		On("FindOne", mock.Anything, bson.M{"_id": idToFetch}).
		Return(srHelperExample)
	srHelperExample.(*mocks.MockSingleResult).
		On("Decode", mock.AnythingOfType("*storage.Game")).
		Return(nil).
		Run(func(args mock.Arguments) {
			arg := args.Get(0).(*models.Game)
			arg.Name = "test-game-1"
		})

	req, err := http.NewRequest("GET", "/game/"+stringID, nil)
	if err != nil {
		t.Fatal(err)
	}

	rctx := chi.NewRouteContext()
	rctx.URLParams.Add("gameID", stringID)

	req = req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))

	res := httptest.NewRecorder()
	handler := GetGame(mockClient)
	handler.ServeHTTP(res, req)

	if res.Code != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			res.Code, http.StatusOK)
	}
	expectedObj, _ := json.Marshal(&models.Game{Name: "test-game-1"})
	expected := string(expectedObj) + "\n"
	if res.Body.String() != expected {
		t.Errorf("handler returned unexpected body: got %v want %v",
			res.Body.String(), expected)
	}

	// Test bad input is handled
	badStringID := "cannot-cast-to-objectid"
	badReq, badReqErr := http.NewRequest("GET", "/game/"+badStringID, nil)
	if badReqErr != nil {
		t.Fatal(err)
	}

	badReqCtx := chi.NewRouteContext()
	badReqCtx.URLParams.Add("gameID", badStringID)

	badReq = badReq.WithContext(context.WithValue(badReq.Context(), chi.RouteCtxKey, badReqCtx))

	badRes := httptest.NewRecorder()
	handler.ServeHTTP(badRes, badReq)
	badExpectedObj := &errors.HTTPError{
		Status:  http.StatusBadRequest,
		IsError: true,
	}
	badResObj := &errors.HTTPError{}
	json.Unmarshal(badRes.Body.Bytes(), badResObj)
	badExpectedObj.Description = badResObj.Description
	assert.ObjectsAreEqual(badResObj, badExpectedObj)
	badExpectedSerialised, _ := json.Marshal(badExpectedObj)
	badExpected := string(badExpectedSerialised) + "\n"
	if badRes.Body.String() != badExpected {
		t.Errorf("handler returned unexpected body: got %v want %v",
			badRes.Body.String(), badExpected)
	}

	// Test not found is handled
	notFoundStringID := "ffffffffffffffffffffffff"

	notFoundReq, notFoundReqErr := http.NewRequest("GET", "/game/"+notFoundStringID, nil)
	if notFoundReqErr != nil {
		t.Fatal(err)
	}

	notFoundReqCtx := chi.NewRouteContext()
	notFoundReqCtx.URLParams.Add("gameID", notFoundStringID)

	notFoundReq = notFoundReq.WithContext(context.WithValue(notFoundReq.Context(), chi.RouteCtxKey, notFoundReqCtx))

	notFoundRes := httptest.NewRecorder()
	handler.ServeHTTP(notFoundRes, notFoundReq)
	notFoundExpectedObj := &errors.HTTPError{
		Status:  http.StatusNotFound,
		IsError: true,
	}
	notFoundResObj := &errors.HTTPError{}
	json.Unmarshal(notFoundRes.Body.Bytes(), notFoundResObj)
	notFoundExpectedObj.Description = notFoundResObj.Description
	assert.ObjectsAreEqual(notFoundResObj, notFoundExpectedObj)
	notFoundExpectedSerialised, _ := json.Marshal(notFoundExpectedObj)
	notFoundExpected := string(notFoundExpectedSerialised) + "\n"
	if notFoundRes.Body.String() != notFoundExpected {
		t.Errorf("handler returned unexpected body: got %v want %v",
			notFoundRes.Body.String(), notFoundExpected)
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
