package mocks

import (
	"context"

	"github.com/Jaeger2305/du-meine-gute/storage"
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

func (mockCollection *MockCollection) Find(...interface{}) (storage.Cursor, error) {
	mockCollection.Called()
	return new(Cursor), nil
}

func (mockCollection *MockCollection) FindOne(ctx context.Context, filter interface{}) storage.SingleResult {
	ret := mockCollection.Called(ctx, filter)
	return ret.Get(0).(storage.SingleResult)
}

func (mockCollection *MockCollection) InsertOne(ctx context.Context, document interface{}) (interface{}, error) {
	ret := mockCollection.Called(ctx, document)
	return ret.Get(0), ret.Error(1)
}

type Cursor struct {
	mock.Mock
}

func (mockCursor *Cursor) Next(...interface{}) bool {
	return true
}
func (mockCursor *Cursor) Close(...interface{}) error {
	return nil
}
func (mockCursor *Cursor) Decode(...interface{}) error {
	return nil
}

type MockSingleResult struct {
	mock.Mock
}

func (mockMockSingleResult *MockSingleResult) Decode(emptyGame interface{}) error {
	ret := mockMockSingleResult.Called(emptyGame)
	if ret.Get(0) == nil {
		return nil
	}
	return ret.Get(0).(error)
}
