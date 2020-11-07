package storage_test

import (
	"testing"

	"github.com/Jaeger2305/du-meine-gute/mocks"
	"github.com/Jaeger2305/du-meine-gute/storage"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestNewClient(t *testing.T) {
	var mockConnector storage.Connector
	var mockClient storage.Client
	mockConnector = &mocks.MockConnector{}
	mockClient = &mocks.MockClient{}
	mockClient.(*mocks.MockClient).On("Ping", mock.Anything, mock.Anything).Return(nil)
	mockConnector.(*mocks.MockConnector).On("Connect", mock.Anything, mock.Anything).Return(mockClient, nil)
	res := storage.NewClient(mockConnector, "test-connection-string")
	assert.NotNil(t, res)
}
