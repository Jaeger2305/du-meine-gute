package repository

import (
	"context"

	"github.com/Jaeger2305/du-meine-gute/storage"
	models "github.com/Jaeger2305/du-meine-gute/storage/models"
)

type gameStore interface {
	FindOne(context.Context, interface{}) (*models.Test, error)
}

type gameDatabase struct {
	db storage.DatabaseHelper
}

func GetGameStore(db storage.DatabaseHelper) gameStore {
	return &gameDatabase{
		db: db,
	}
}

func (g *gameDatabase) FindOne(ctx context.Context, filter interface{}) (*models.Test, error) {
	game := &models.Test{}
	err := g.db.Collection("games").FindOne(ctx, filter).Decode(game)
	if err != nil {
		return nil, err
	}
	return game, nil
}
