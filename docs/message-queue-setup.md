# Message queue set up

This app is using Kafka. It's massively overpowered for what it needs. It meets the following criteria:

1. Messaging of websockets across [separate server instances](https://hackernoon.com/scaling-websockets-9a31497af051)
1. Potential future integration with [cloud services](https://www.confluent.io/azure/?utm_medium=sem&utm_source=google&utm_campaign=ch.sem_br.nonbrand_tp.prs_tgt.kafka_mt.mbm_rgn.emea_lng.eng_dv.all&utm_term=%2Bkafka%20%2Bazure&creative=&device=c&placement=&gclid=Cj0KCQjwhIP6BRCMARIsALu9Lfn6lehMziNavfOl5oKas05QbLm1Xkz-oJyvDjPseiI2as18cmczm_0aAtFeEALw_wcB)
1. Free and open source
1. Runs locally, no Azure subscription needed

## Set up

Roughly following an [excellent blog article](https://medium.com/@yusufs/getting-started-with-kafka-in-golang-14ccab5fa26)

Set up the kafka instances and zookeepers

`MY_IP=192.168.178.98 docker-compose up -d`

Create the game topic

`docker run --net=host --rm confluentinc/cp-kafka:5.0.0 kafka-topics --create --topic game --partitions 4 --replication-factor 2 --if-not-exists --zookeeper localhost:32181`

Test with kafkacat. The replication factor here is important - starting with fewer kafka instances will cause issues. There should be a way to configure this, but I haven't looked into this.

`kafkacat -C -b localhost:19092,localhost:29092,localhost:39092 -t game -p 0`

There is no volume mapping of the config or the logs, and in my experience the containers trip over themselves unless restarting from scratch. If having issues, `docker-compose down --volumes` can be your friend.

## Server integration

There were a few choices, and all look viable and maintained. I followed the article for simplicity. If the support for multiple partitions is implemented in the confluent/samara version, those would probably be better.

[kafka-go](https://godoc.org/github.com/segmentio/kafka-go)
[confluent-kafka-go](https://github.com/confluentinc/confluent-kafka-go)
[samara](https://github.com/Shopify/sarama)
