package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/Jaeger2305/du-meine-gute/mocks"
	"github.com/Jaeger2305/du-meine-gute/responses"
	"github.com/Jaeger2305/du-meine-gute/storage"
	models "github.com/Jaeger2305/du-meine-gute/storage/models"
	"github.com/go-chi/chi"
	"github.com/gorilla/websocket"
)

var mockClient storage.Client
var mockDb storage.Database
var mockCollection storage.Collection
var srHelperExample storage.SingleResult
var srHelperError storage.SingleResult
var mockCursor storage.Cursor

// TestJoinGame returns the game thats been joined
func TestJoinGame(t *testing.T) {
	// Arrange
	mockUsername := "test-user"
	mockClient = &mocks.MockClient{}
	mockDb = &mocks.MockDatabase{}
	mockCollection = &mocks.MockCollection{}
	srHelperExample = &mocks.MockSingleResult{}
	srHelperExample.(*mocks.MockSingleResult).
		On("Decode", mock.AnythingOfType("*storage.Game")).
		Return(nil).
		Run(func(args mock.Arguments) {
			arg := args.Get(0).(*models.Game)
			arg.Name = "test-game-1"
		})
	mockGameID := "5f2e8e87bef4c2c54981fc85"
	idToFetch, _ := primitive.ObjectIDFromHex(mockGameID)
	mockDb.(*mocks.MockDatabase).Db.
		On("Collection", "games").Return(mockCollection)
	mockClient.(*mocks.MockClient).
		On("Database", "du-meine-gute").Return(mockDb)
	mockCollection.(*mocks.MockCollection).
		On("UpdateOne", mock.Anything, mock.Anything, mock.Anything).
		Return(&mongo.UpdateResult{
			ModifiedCount: 1,
		}, nil)
	mockCollection.(*mocks.MockCollection).
		On("FindOne", mock.Anything, bson.M{"_id": idToFetch}).
		Return(srHelperExample)

	mockSessionManager := &mocks.MockSessionManager{}
	mockSession := &mocks.MockSession{}
	mockSession.On("SessionRelease", mock.Anything).Return()
	mockSession.On("Get", "username").Return(mockUsername)
	mockSession.On("Get", "activegame").Return(nil)
	mockSession.On("Set", "activegame", mockGameID).Return(nil)

	mockSessionManager.On("SessionStart", mock.Anything, mock.Anything).Return(mockSession, nil)

	// Act
	updates, _ := json.Marshal(&bson.M{"GameID": mockGameID})
	req, err := http.NewRequest("POST", "/game/join", bytes.NewBuffer(updates))
	if err != nil {
		t.Fatal(err)
	}
	res := httptest.NewRecorder()
	handler := JoinGame(mockClient, mockSessionManager)
	handler.ServeHTTP(res, req)

	// Assert
	if res.Code != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			res.Code, http.StatusOK)
	}
	expectedObj, _ := json.Marshal(&responses.HTTPBasic{
		Status:      200,
		Description: "Updated successfully",
		IsError:     false,
	})
	expected := string(expectedObj) + "\n"
	if res.Body.String() != expected {
		t.Errorf("handler returned unexpected body: got %v want %v",
			res.Body.String(), expected)
	}
}

// TestLeaveGame returns the game thats been left
func TestLeaveGame(t *testing.T) {
	// Arrange
	mockUsername := "test-user"
	mockClient = &mocks.MockClient{}
	mockDb = &mocks.MockDatabase{}
	mockCollection = &mocks.MockCollection{}
	srHelperExample = &mocks.MockSingleResult{}
	srHelperError = &mocks.MockSingleResult{}
	mockGameID := "5f2e8e87bef4c2c54981fc85"
	mockDb.(*mocks.MockDatabase).Db.
		On("Collection", "games").Return(mockCollection)
	mockClient.(*mocks.MockClient).
		On("Database", "du-meine-gute").Return(mockDb)
	mockCollection.(*mocks.MockCollection).
		On("UpdateOne", mock.Anything, mock.Anything, mock.Anything).
		Return(&mongo.UpdateResult{
			ModifiedCount: 1,
		}, nil)

	mockSessionManager := &mocks.MockSessionManager{}
	mockSession := &mocks.MockSession{}
	mockSession.On("SessionRelease", mock.Anything).Return()
	mockSession.On("Get", "username").Return(mockUsername)
	mockSession.On("Get", "activegame").Return(mockGameID)
	mockSession.On("Delete", "activegame").Return(nil)

	mockSessionManager.On("SessionStart", mock.Anything, mock.Anything).Return(mockSession, nil)

	// Act
	updates, _ := json.Marshal(&bson.M{"GameID": mockGameID})
	req, err := http.NewRequest("POST", "/game/leave", bytes.NewBuffer(updates))
	if err != nil {
		t.Fatal(err)
	}
	res := httptest.NewRecorder()
	handler := LeaveGame(mockClient, mockSessionManager)
	handler.ServeHTTP(res, req)

	// Assert
	if res.Code != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			res.Code, http.StatusOK)
	}
	expectedObj, _ := json.Marshal(&responses.HTTPBasic{
		Status:      200,
		Description: "Updated successfully",
		IsError:     false,
	})
	expected := string(expectedObj) + "\n"
	if res.Body.String() != expected {
		t.Errorf("handler returned unexpected body: got %v want %v",
			res.Body.String(), expected)
	}
}

func TestGetGames(t *testing.T) {
	// Because we're not using an object and accessing its methods, the whole structure needs to be mocked at the moment.
	mockClient = &mocks.MockClient{}
	mockDb = &mocks.MockDatabase{}
	mockCollection = &mocks.MockCollection{}
	mockCursor = &mocks.MockCursor{}
	mockDb.(*mocks.MockDatabase).Db.
		On("Collection", "games").Return(mockCollection)
	mockClient.(*mocks.MockClient).
		On("Database", "du-meine-gute").Return(mockDb)
	mockCursor.(*mocks.MockCursor).
		On("Decode", mock.AnythingOfType("*storage.Game")).
		Return(nil).
		Run(func(args mock.Arguments) {
			arg := args.Get(0).(*models.Game)
			arg.Name = "mocked-game"
		})
	mockCursor.(*mocks.MockCursor).
		On("Next", mock.Anything).
		Return(true).
		Twice()
	mockCursor.(*mocks.MockCursor).
		On("Next", mock.Anything).
		Return(false).
		Once()
	mockCursor.(*mocks.MockCursor).
		On("Close", mock.Anything).
		Return(nil)

	mockCollection.(*mocks.MockCollection).
		On("Find", mock.Anything, bson.D{}).
		Return(mockCursor, nil)

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
	var expectedGames []*models.Game
	expectedGames = append(expectedGames, &models.Game{Name: "mocked-game"}, &models.Game{Name: "mocked-game"})
	expectedBytes, _ := json.Marshal(expectedGames)
	expected := string(expectedBytes) + "\n"
	if res.Body.String() != expected {
		t.Errorf("handler returned unexpected body: got %v want %v",
			res.Body.String(), expected)
	}
}

func TestGetGame(t *testing.T) {
	stringID := "5ed91ed202c719f3f43e23af"
	notFoundStringID := "ffffffffffffffffffffffff"
	idToFetch, _ := primitive.ObjectIDFromHex(stringID)
	notFoundIDToFetch, _ := primitive.ObjectIDFromHex(notFoundStringID)
	// Because we're not using an object and accessing its methods, the whole structure needs to be mocked at the moment.
	mockClient = &mocks.MockClient{}
	mockDb = &mocks.MockDatabase{}
	mockCollection = &mocks.MockCollection{}
	srHelperExample = &mocks.MockSingleResult{}
	srHelperError = &mocks.MockSingleResult{}
	mockDb.(*mocks.MockDatabase).Db.
		On("Collection", "games").Return(mockCollection)
	mockClient.(*mocks.MockClient).
		On("Database", "du-meine-gute").Return(mockDb)
	mockCollection.(*mocks.MockCollection).
		On("FindOne", mock.Anything, bson.M{"_id": idToFetch}).
		Return(srHelperExample)
	mockCollection.(*mocks.MockCollection).
		On("FindOne", mock.Anything, bson.M{"_id": notFoundIDToFetch}).
		Return(srHelperError)
	srHelperError.(*mocks.MockSingleResult).
		On("Decode", mock.AnythingOfType("*storage.Game")).
		Return(mongo.ErrNoDocuments)
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
	badExpectedObj := &responses.HTTPBasic{
		Status:  http.StatusBadRequest,
		IsError: true,
	}
	badResObj := &responses.HTTPBasic{}
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
	notFoundReq, notFoundReqErr := http.NewRequest("GET", "/game/"+notFoundStringID, nil)
	if notFoundReqErr != nil {
		t.Fatal(err)
	}

	notFoundReqCtx := chi.NewRouteContext()
	notFoundReqCtx.URLParams.Add("gameID", notFoundStringID)

	notFoundReq = notFoundReq.WithContext(context.WithValue(notFoundReq.Context(), chi.RouteCtxKey, notFoundReqCtx))

	notFoundRes := httptest.NewRecorder()
	handler.ServeHTTP(notFoundRes, notFoundReq)
	notFoundExpectedObj := &responses.HTTPBasic{
		Status:  http.StatusNotFound,
		IsError: true,
	}
	notFoundResObj := &responses.HTTPBasic{}
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

func TestCreateGame(t *testing.T) {
	// Arrange
	mockClient = &mocks.MockClient{}
	mockDb = &mocks.MockDatabase{}
	mockCollection = &mocks.MockCollection{}
	srHelperExample = &mocks.MockSingleResult{}
	srHelperError = &mocks.MockSingleResult{}
	mockDb.(*mocks.MockDatabase).Db.
		On("Collection", "games").Return(mockCollection)
	mockClient.(*mocks.MockClient).
		On("Database", "du-meine-gute").Return(mockDb)
	mockCollection.(*mocks.MockCollection).
		On("InsertOne", mock.Anything, &models.Game{
			Name: "test-game-1",
		}).
		Return(&models.Game{
			Name: "test-game-1",
		}, nil)

	newGameJSON, _ := json.Marshal(&models.Game{Name: "test-game-1"})

	// Act
	req, err := http.NewRequest("POST", "/game", bytes.NewBuffer(newGameJSON))
	if err != nil {
		t.Fatal(err)
	}
	res := httptest.NewRecorder()
	handler := CreateGame(mockClient)
	handler.ServeHTTP(res, req)

	// Should test a few more invalid inputs here, but this is just a quick test for now.

	// Assert
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
	router.Get("/game/live", GetLive)
	server := httptest.NewServer(router)
	defer server.Close()

	wsURL := "ws" + strings.TrimPrefix(server.URL, "http") + "/game/live"

	ws, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("could not open a ws connection on %s %v", wsURL, err)
	}
	defer ws.Close()

	if err := ws.WriteMessage(websocket.TextMessage, []byte("success")); err != nil {
		t.Fatalf("could not send message over ws connection %v", err)
	}
}
