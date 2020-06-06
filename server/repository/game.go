package repository

import (
	"context"
	"log"

	"github.com/Jaeger2305/du-meine-gute/storage"
	models "github.com/Jaeger2305/du-meine-gute/storage/models"
)

func GetGameStore(client storage.Client) storage.Collection {
	return client.Database("du-meine-gute").Collection("games")
}

func FindOne(store storage.Collection, ctx context.Context, filter interface{}) (*models.Game, error) {
	game := &models.Game{}
	err := store.FindOne(ctx, filter).Decode(game)
	if err != nil {
		return nil, err
	}
	return game, nil
}

func Find(store storage.Collection, ctx context.Context, filter interface{}) ([]*models.Game, error) {
	var games []*models.Game
	cur, err := store.Find(ctx, filter)
	defer cur.Close(context.Background())
	if err != nil {
		return nil, err
	}

	for cur.Next(ctx) {

		// create a value into which the single document can be decoded
		var game models.Game
		err := cur.Decode(&game)
		if err != nil {
			log.Fatal(err)
		}

		games = append(games, &game)
	}

	return games, nil
}
