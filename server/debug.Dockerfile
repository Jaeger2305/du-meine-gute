FROM golang:1.14

# vscode doesn't have a way of mapping local to remote files like Node does
# Debugging will only work if the paths therefore match
# A bit silly, but not the end of the world.
# https://stackoverflow.com/a/61254798/2276412
WORKDIR /go/src/app/server

RUN go get github.com/go-delve/delve/cmd/dlv

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source from the current directory to the Working Directory inside the container
COPY . .