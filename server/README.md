# Getting started

Copy the default.env.template and remove the template extension. This contains sensible defaults for local development.

Ensure you have mongo available

`docker run --name du-meine-gute -v ~/personal/du-meine-gute/ignore:/data/db -p 27017:27017 -d mongo`

This builds and runs the main server, starting on port 4444 by default.

`go run ./cmd`

To build and run as a standalone executable:

```
go build -o du-meine-gute.exe ./cmd
./du-meine-gute
```

# Tests

`go test ./...`
