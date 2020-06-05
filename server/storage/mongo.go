package storage

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// type Connector func(context.Context, ...*options.ClientOptions) (*mongo.Client, error)

type Connector interface {
	Connect(context.Context, ...*options.ClientOptions) (ClientHelper, error)
}

type Client interface {
	GetMongoConnection(...interface{}) ClientHelper
}

type ClientHelper interface {
	Database(string, ...*options.DatabaseOptions) DatabaseHelper
	// Disconnect(context.Context) error
}

type DatabaseHelper interface {
	Collection(string) CollectionHelper
}

type CollectionHelper interface {
	FindOne(context.Context, interface{}) SingleResultHelper
	InsertOne(context.Context, interface{}) (interface{}, error)
	// Find(context.Context, ...interface{}) (Cursor, error)
}

type SingleResultHelper interface {
	Decode(v interface{}) error
}

type Cursor interface {
	Next(...interface{}) bool
	Close(...interface{}) error
	Decode(...interface{}) error
}

type MongoConnector struct{}

func (mc *MongoConnector) Connect(context context.Context, options ...*options.ClientOptions) (ClientHelper, error) {
	client, err := mongo.Connect(context, options...)
	return &mongoClient{
		cl: client,
	}, err
}

type mongoClient struct {
	cl *mongo.Client
}
type mongoDatabase struct {
	db *mongo.Database
}
type mongoCollection struct {
	coll *mongo.Collection
}

type mongoSingleResult struct {
	sr *mongo.SingleResult
}

func (mc *mongoClient) Database(dbName string, options ...*options.DatabaseOptions) DatabaseHelper {
	db := mc.cl.Database(dbName)
	return &mongoDatabase{db: db}
}

// func (mc *mongoClient) Disconnect(context context.Context) error {
// 	err := mc.cl.Disconnect(context)
// 	return &mongoDatabase{error: err}
// }

func (md *mongoDatabase) Collection(colName string) CollectionHelper {
	collection := md.db.Collection(colName)
	return &mongoCollection{coll: collection}
}

func (mc *mongoCollection) InsertOne(ctx context.Context, document interface{}) (interface{}, error) {
	res, err := mc.coll.InsertOne(ctx, document)
	return res, err
}

func (mc *mongoCollection) FindOne(ctx context.Context, filter interface{}) SingleResultHelper {
	singleResult := mc.coll.FindOne(ctx, filter)
	return &mongoSingleResult{sr: singleResult}
}

func (sr *mongoSingleResult) Decode(v interface{}) error {
	return sr.sr.Decode(v)
}

// NewClient retrieves a DB connection to a mongo instance.
func NewClient(connector Connector, connectionString string) ClientHelper {
	// Set client options
	clientOptions := options.Client().ApplyURI(connectionString)

	// Connect to MongoDB
	connectContext, cancelConnectAttempt := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancelConnectAttempt()
	client, err := connector.Connect(connectContext, clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	// Check the connection
	// err = client.Ping(context.TODO(), nil)

	if err != nil {
		log.Fatal(err)
	}
	return client
}

func NewDatabase(dbName string, client ClientHelper) DatabaseHelper {
	return client.Database(dbName)
}

// func (u *gameDatabase) FindOne(ctx context.Context, filter interface{}) (*models.Game, error) {
// 	game := &models.Game{}
// 	err := g.db.Collection(collectionName).FindOne(ctx, filter).Decode(game)
// 	if err != nil {
// 		return nil, err
// 	}
// 	return user, nil
// }
