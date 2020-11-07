package kafka

import (
	"context"

	"time"

	"github.com/segmentio/kafka-go"
)

func Push(context context.Context, writer *kafka.Writer, key, value []byte) (err error) {
	message := kafka.Message{
		Key:   key,
		Value: value,
		Time:  time.Now(),
	}

	return writer.WriteMessages(context, message)
}
