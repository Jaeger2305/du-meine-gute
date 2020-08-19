package storage

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/astaxie/beego/session"
	"github.com/spf13/viper"
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
	UpdateOne(context.Context, interface{}, interface{}, *options.UpdateOptions) (interface{}, error)
	InsertOne(context.Context, interface{}) (interface{}, error)
	Find(context.Context, interface{}) (Cursor, error)
}

type SingleResult interface {
	Decode(v interface{}) error
}

type Cursor interface {
	Next(context.Context) bool
	Close(context.Context) error
	Decode(v interface{}) error
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

func (mc *mongoCollection) UpdateOne(ctx context.Context, filter interface{}, update interface{}, options *options.UpdateOptions) (interface{}, error) {
	res, err := mc.coll.UpdateOne(ctx, filter, update, options)
	return res, err
}

func (mc *mongoCollection) FindOne(ctx context.Context, filter interface{}) SingleResult {
	singleResult := mc.coll.FindOne(ctx, filter)
	return &mongoSingleResult{sr: singleResult}
}

func (mc *mongoCollection) Find(ctx context.Context, filter interface{}) (Cursor, error) {
	result, err := mc.coll.Find(ctx, filter)
	return &mongoCursor{cur: result}, err
}

type mongoCursor struct {
	cur *mongo.Cursor
}

func (cur *mongoCursor) Close(ctx context.Context) error {
	return cur.cur.Close(ctx)
}

func (cur *mongoCursor) Decode(v interface{}) error {
	return cur.cur.Decode(v)
}

func (cur *mongoCursor) Next(ctx context.Context) bool {
	return cur.cur.Next(ctx)
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

type SessionManager interface {
	SessionStart(w http.ResponseWriter, r *http.Request) (session.Store, error)
}

// type SessionManager struct{}

// func (sm *SessionManager) SessionStart(w http.ResponseWriter, r *http.Request) (Session, error) {
// 	return session.Manager.SessionStart(w, r)
// }

type Session interface {
	SessionRelease(w http.ResponseWriter)
	Get(key interface{}) interface{}
	Set(key interface{}, value interface{}) error
}

func NewSessionManager() SessionManager {
	sessionConfig := &session.ManagerConfig{
		CookieName:      "gosessionid",
		EnableSetCookie: false,
		ProviderConfig:  fmt.Sprintf("{\"cookieName\":\"gosessionid\",\"securityKey\":\"%s\"}", viper.GetString("DMG_SESSION_SECRET")),
		Gclifetime:      3600,
		Secure:          viper.GetString("DMG_ENV") != "development",
	}
	sessionManager, newManagerError := session.NewManager("cookie", sessionConfig)

	if newManagerError != nil {
		log.Fatal("Couldn't get manager", newManagerError)
	}

	go sessionManager.GC()

	return sessionManager
}
