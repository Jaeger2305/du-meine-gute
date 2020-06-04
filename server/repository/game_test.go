package repository

import (
	"context"
	"errors"
	"testing"

	"github.com/Jaeger2305/du-meine-gute/mocks"
	databases "github.com/Jaeger2305/du-meine-gute/storage"
	models "github.com/Jaeger2305/du-meine-gute/storage/models"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Define variables for interfaces
var mockClient databases.ClientHelper
var mockDb databases.DatabaseHelper
var mockCollection databases.CollectionHelper
var srHelperErr databases.SingleResultHelper
var srHelperCorrect databases.SingleResultHelper

func TestGetGameStore(t *testing.T) {
	// Set interfaces implementation to mocked structures
	mockClient = &mocks.MongoClient{}
	mockDb = &mocks.MockDatabase{}
	mockCollection = &mocks.CollectionHelper{}
	mockDb.(*mocks.MockDatabase).Db.
		On("Collection", "games").Return(mockCollection)

	mockClient.(*mocks.MongoClient).
		On("Database", "du-meine-gute").Return(mockDb)

	gameStore := GetGameStore(mockClient)
	assert.Equal(t, gameStore, &mocks.CollectionHelper{})
}

func TestFindOne(t *testing.T) {
	// Set interfaces implementation to mocked structures
	mockCollection = &mocks.CollectionHelper{}
	srHelperErr = &mocks.SingleResultHelper{}
	srHelperCorrect = &mocks.SingleResultHelper{}

	// Because interfaces does not implement mock.Mock functions we need to use
	// type assertion to mock implemented methods
	srHelperErr.(*mocks.SingleResultHelper).
		On("Decode", mock.AnythingOfType("*storage.Test")).
		Return(errors.New("mocked-error"))

	srHelperCorrect.(*mocks.SingleResultHelper).
		On("Decode", mock.AnythingOfType("*storage.Test")).
		Return(nil).
		Run(func(args mock.Arguments) {
			arg := args.Get(0).(*models.Test)
			arg.Name = "mocked-game"
		})

	mockCollection.(*mocks.CollectionHelper).
		On("FindOne", context.Background(), primitive.M{"error": true}).
		Return(srHelperErr)

	mockCollection.(*mocks.CollectionHelper).
		On("FindOne", context.Background(), primitive.M{"error": false}).
		Return(srHelperCorrect)

	// Call method with defined filter, that in our mocked function returns
	// mocked-error
	game, err := FindOne(mockCollection, context.Background(), primitive.M{"error": true})

	assert.Empty(t, game)
	assert.EqualError(t, err, "mocked-error")

	// Now call the same function with different different filter for correct
	// result
	game, _ = FindOne(mockCollection, context.Background(), primitive.M{"error": false})

	assert.Equal(t, &models.Test{Name: "mocked-game"}, game)
	// assert.NoError(t, err)
}
