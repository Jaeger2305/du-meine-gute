package repository

import (
	"context"
	"errors"
	"testing"

	"github.com/Jaeger2305/du-meine-gute/storage"
	databases "github.com/Jaeger2305/du-meine-gute/storage"
	models "github.com/Jaeger2305/du-meine-gute/storage/models"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MongoClient struct {
	mock.Mock
}

type DatabaseHelper struct {
	mock.Mock
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
	mockClient.Called(dbName)
	return new(DatabaseHelper)
}

func (mockClient *MongoClient) Disconnect(context context.Context) error {
	return nil
}

func (mockDatabase *DatabaseHelper) Collection(collectionName string) storage.CollectionHelper {
	mockDatabase.Called(collectionName)
	return new(CollectionHelper)
}

func (mockCollection *CollectionHelper) Find(...interface{}) (storage.Cursor, error) {
	mockCollection.Called()
	return new(Cursor), nil
}

func (mockCollection *CollectionHelper) FindOne(ctx context.Context, filter interface{}) storage.SingleResultHelper {
	mockCollection.Called(ctx, filter)
	return new(SingleResultHelper)
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

func (mockSingleResultHelper *SingleResultHelper) Decode(interface{}) error {
	return nil
}

func TestFindOne(t *testing.T) {

	// Define variables for interfaces
	var dbHelper databases.DatabaseHelper
	var collectionHelper databases.CollectionHelper
	var srHelperErr databases.SingleResultHelper
	var srHelperCorrect databases.SingleResultHelper

	// Set interfaces implementation to mocked structures
	dbHelper = &DatabaseHelper{}
	collectionHelper = &CollectionHelper{}
	srHelperErr = &SingleResultHelper{}
	srHelperCorrect = &SingleResultHelper{}

	// Because interfaces does not implement mock.Mock functions we need to use
	// type assertion to mock implemented methods
	srHelperErr.(*SingleResultHelper).
		On("Decode", mock.AnythingOfType("*models.Test")).
		Return(errors.New("mocked-error"))

	srHelperCorrect.(*SingleResultHelper).
		On("Decode", mock.AnythingOfType("*models.Test")).
		Return(nil).
		Run(func(args mock.Arguments) {
			arg := args.Get(0).(*models.Test)
			arg.Name = "mocked-game"
		})

	collectionHelper.(*CollectionHelper).
		On("FindOne", context.Background(), bson.M{"error": true}).
		Return(srHelperErr)

	collectionHelper.(*CollectionHelper).
		On("FindOne", context.Background(), bson.M{"error": false}).
		Return(srHelperCorrect)

	dbHelper.(*DatabaseHelper).
		On("Collection", "games").Return(collectionHelper)

	// Create new database with mocked Database interface
	// gameDba := GetGameStore(dbHelper)

	// Call method with defined filter, that in our mocked function returns
	// mocked-error
	game := collectionHelper.FindOne(context.Background(), bson.M{"error": true})

	assert.Empty(t, game)
	// assert.EqualError(t, err, "mocked-error")

	// Now call the same function with different different filter for correct
	// result
	// game, err = gameDba.FindOne(context.Background(), bson.M{"error": false})

	assert.Equal(t, &models.Test{Name: "mocked-game"}, game)
	// assert.NoError(t, err)
}
