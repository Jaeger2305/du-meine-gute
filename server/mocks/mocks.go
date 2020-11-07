package mocks

import (
	"context"
	"net/http"

	"github.com/Jaeger2305/du-meine-gute/storage"
	"github.com/astaxie/beego/session"
	"github.com/stretchr/testify/mock"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type MockConnector struct {
	mock.Mock
}

func (mockConnector *MockConnector) Connect(context context.Context, options ...*options.ClientOptions) (storage.Client, error) {
	ret := mockConnector.Called(context, options)
	return ret.Get(0).(storage.Client), ret.Error(1)
}

type MockClient struct {
	mock.Mock
}

func (mockClient *MockClient) Database(dbName string, options ...*options.DatabaseOptions) storage.Database {
	ret := mockClient.Called(dbName)
	return ret.Get(0).(storage.Database)
}

func (mockClient *MockClient) Disconnect(context context.Context) error {
	ret := mockClient.Called(context)
	return ret.Error(0)
}

func (mockClient *MockClient) Ping(context context.Context, rp *readpref.ReadPref) error {
	ret := mockClient.Called(context, rp)
	return ret.Error(0)
}

type MockDatabase struct {
	Db mock.Mock
}

func (mockDatabase *MockDatabase) Collection(collectionName string) storage.Collection {
	ret := mockDatabase.Db.Called(collectionName)
	return ret.Get(0).(storage.Collection)
}

type MockCollection struct {
	mock.Mock
}

func (mockCollection *MockCollection) Find(ctx context.Context, filter interface{}) (storage.Cursor, error) {
	ret := mockCollection.Called(ctx, filter)
	return ret.Get(0).(storage.Cursor), ret.Error(1)
}

func (mockCollection *MockCollection) FindOne(ctx context.Context, filter interface{}) storage.SingleResult {
	ret := mockCollection.Called(ctx, filter)
	return ret.Get(0).(storage.SingleResult)
}

func (mockCollection *MockCollection) InsertOne(ctx context.Context, document interface{}) (interface{}, error) {
	ret := mockCollection.Called(ctx, document)
	return ret.Get(0), ret.Error(1)
}

func (mockCollection *MockCollection) UpdateOne(ctx context.Context, filter interface{}, update interface{}, options *options.UpdateOptions) (interface{}, error) {
	ret := mockCollection.Called(ctx, filter, update, options)
	return ret.Get(0), ret.Error(1)
}

type MockCursor struct {
	mock.Mock
}

func (mockCursor *MockCursor) Next(ctx context.Context) bool {
	ret := mockCursor.Called(ctx)
	return ret.Get(0).(bool)
}
func (mockCursor *MockCursor) Close(ctx context.Context) error {
	ret := mockCursor.Called(ctx)
	return ret.Error(0)
}
func (mockCursor *MockCursor) Decode(emptyElem interface{}) error {
	ret := mockCursor.Called(emptyElem)
	return ret.Error(0)
}

type MockSingleResult struct {
	mock.Mock
}

func (mockMockSingleResult *MockSingleResult) Decode(emptyElem interface{}) error {
	ret := mockMockSingleResult.Called(emptyElem)
	if ret.Get(0) == nil {
		return nil
	}
	return ret.Get(0).(error)
}

type MockSessionManager struct {
	mock.Mock
}

func (mockSessionManager *MockSessionManager) SessionStart(w http.ResponseWriter, r *http.Request) (session.Store, error) {
	ret := mockSessionManager.Called(w, r)
	return ret.Get(0).(session.Store), ret.Error(1)
}

type MockSession struct {
	mock.Mock
}

func (mockSession *MockSession) SessionRelease(w http.ResponseWriter) {
	mockSession.Called(w)
	return
}

func (mockSession *MockSession) Get(key interface{}) interface{} {
	ret := mockSession.Called(key)
	return ret.Get(0)
}

func (mockSession *MockSession) Set(key interface{}, value interface{}) error {
	ret := mockSession.Called(key, value)
	return ret.Error(0)
}

func (mockSession *MockSession) Delete(key interface{}) error {
	ret := mockSession.Called(key)
	return ret.Error(0)
}
func (mockSession *MockSession) Flush() error {
	ret := mockSession.Called()
	return ret.Error(0)
}
func (mockSession *MockSession) SessionID() string {
	ret := mockSession.Called()
	return ret.String(0)
}
