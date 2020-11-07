# Server

The server side code of du-meine-gute, written in code. A REST HTTP server, with the ability to upgrade connections to websockets.

It depends on a running mongo server and a Kafka queue.

Requests can be submitted via postman and/or smart websockets plugin in chrome.

## Development

This project should be run from the root via the docker compose, but if not here are some instructions.

Ensure you have mongo available

`docker run --name du-meine-gute -v ~/personal/du-meine-gute/ignore:/data/db -p 27017:27017 -d mongo`

This no longer relies on a `.env` file - values should be supplied at the command line.

```bash
DMG_CONNECTION_STRING=mongodb://localhost:27017/du-meine-gute DMG_HOST=localhost DMG_PORT=4444 DMG_SESSION_SECRET=local-session-secret DMG_ENV=development DMG_MESSAGE_QUEUE_BROKER_URLS=localhost:19092,localhost:29092 DMG_MESSAGE_QUEUE_CLIENT_ID=du-meine-gute-server-local DMG_MESSAGE_QUEUE_TOPIC=game go run ./cmd
```

This builds and runs the main server, starting on port 4444 by default.
To build and run as a standalone executable:

```go
go build -o du-meine-gute.exe ./cmd
./du-meine-gute
```

## Tests

`go test ./...`

## Hosting

Not implemented yet.
