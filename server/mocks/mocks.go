package mocks

import (
	"context"

	"github.com/Jaeger2305/du-meine-gute/storage"
	"github.com/stretchr/testify/mock"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MockConnector struct {
	mock.Mock
}

func (mockConnector *MockConnector) Connect(context context.Context, options ...*options.ClientOptions) (storage.ClientHelper, error) {
	ret := mockConnector.Called(context, options)
	return ret.Get(0).(storage.ClientHelper), ret.Error(1)
}

type MongoClient struct {
	mock.Mock
}

type MockDatabase struct {
	Db mock.Mock
}

type CollectionHelper struct {
	mock.Mock
}

type Cursor struct {
	mock.Mock
}

type SingleResultHelper struct {
	mock.Mock
}

type GameStore struct {
	mock.Mock
}

func (mockClient *MongoClient) Database(dbName string, options ...*options.DatabaseOptions) storage.DatabaseHelper {
	ret := mockClient.Called(dbName)
	return ret.Get(0).(storage.DatabaseHelper)
}

func (mockClient *MongoClient) Disconnect(context context.Context) error {
	return nil
}

func (mockDatabase *MockDatabase) Collection(collectionName string) storage.CollectionHelper {
	ret := mockDatabase.Db.Called(collectionName)
	return ret.Get(0).(storage.CollectionHelper)
}

func (mockCollection *CollectionHelper) Find(...interface{}) (storage.Cursor, error) {
	mockCollection.Called()
	return new(Cursor), nil
}

func (mockCollection *CollectionHelper) FindOne(ctx context.Context, filter interface{}) storage.SingleResultHelper {
	ret := mockCollection.Called(ctx, filter)
	return ret.Get(0).(storage.SingleResultHelper)
}

func (mockCollection *CollectionHelper) InsertOne(ctx context.Context, document interface{}) (interface{}, error) {
	ret := mockCollection.Called(ctx, document)
	return ret.Get(0), ret.Error(1)
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

func (mockSingleResultHelper *SingleResultHelper) Decode(emptyGame interface{}) error {
	ret := mockSingleResultHelper.Called(emptyGame)
	if ret.Get(0) == nil {
		return nil
	}
	return ret.Get(0).(error)
}
