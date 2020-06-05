package storage

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type Connector interface {
	Connect(context.Context, ...*options.ClientOptions) (Client, error)
}

type Client interface {
	Database(string, ...*options.DatabaseOptions) Database
	Disconnect(context.Context) error
	Ping(context.Context, *readpref.ReadPref) error
}

type Database interface {
	Collection(string) Collection
}

type Collection interface {
	FindOne(context.Context, interface{}) SingleResult
	InsertOne(context.Context, interface{}) (interface{}, error)
	// Find(context.Context, ...interface{}) (Cursor, error)
}

type SingleResult interface {
	Decode(v interface{}) error
}

type Cursor interface {
	Next(...interface{}) bool
	Close(...interface{}) error
	Decode(...interface{}) error
}

type MongoConnector struct{}

func (mc *MongoConnector) Connect(context context.Context, options ...*options.ClientOptions) (Client, error) {
	client, err := mongo.Connect(context, options...)
	return &mongoClient{
		cl: client,
	}, err
}

type mongoClient struct {
	cl *mongo.Client
}

func (mc *mongoClient) Database(dbName string, options ...*options.DatabaseOptions) Database {
	db := mc.cl.Database(dbName)
	return &mongoDatabase{db: db}
}

func (mc *mongoClient) Disconnect(context context.Context) error {
	return mc.cl.Disconnect(context)
}

func (mc *mongoClient) Ping(context context.Context, rp *readpref.ReadPref) error {
	return mc.cl.Ping(context, rp)
}

type mongoDatabase struct {
	db *mongo.Database
}

func (md *mongoDatabase) Collection(colName string) Collection {
	collection := md.db.Collection(colName)
	return &mongoCollection{coll: collection}
}

type mongoCollection struct {
	coll *mongo.Collection
}

func (mc *mongoCollection) InsertOne(ctx context.Context, document interface{}) (interface{}, error) {
	res, err := mc.coll.InsertOne(ctx, document)
	return res, err
}

func (mc *mongoCollection) FindOne(ctx context.Context, filter interface{}) SingleResult {
	singleResult := mc.coll.FindOne(ctx, filter)
	return &mongoSingleResult{sr: singleResult}
}

type mongoSingleResult struct {
	sr *mongo.SingleResult
}

func (sr *mongoSingleResult) Decode(v interface{}) error {
	return sr.sr.Decode(v)
}

// NewClient retrieves a DB connection to a mongo instance.
func NewClient(connector Connector, connectionString string) Client {
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
	pingContext, cancelPingAttempt := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancelPingAttempt()
	err = client.Ping(pingContext, nil)

	if err != nil {
		log.Fatal(err)
	}
	return client
}
