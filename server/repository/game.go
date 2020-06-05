package repository

import (
	"context"

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
