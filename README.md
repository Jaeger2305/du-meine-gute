# Du Meine Güte

A digitised version of a 2 player board game where players compete to produce goods in the most efficient way.

A hobby project to improve some technical skills.

Primary goals:

1. Go server managing WebSocket connections
1. TypeScript and type led clientside development
1. Solitaire implementation of the game

Stretch goals:

1. App based client (NativeScript Vue)
1. Hosted and not just local
1. Multiple concurrent games
1. Multiplayer

Roadmap:

1. Go WebSocket server skeleton
1. Vue-cli TypeScript skeleton client side
1. Persisted data in Mongo
1. Simple game round E2E
1. Functionally complete API server
1. Functionally complete API client side
1. Minimal styling client side
1. Multiple games
1. NativeScript Vue implementation
1. Hosting

## Getting started

There are some READMEs in the folders, as well as a docs folder for more general information, including an architecture diagram.

Locally, a lot is configured in the docker-compose file. This does need your IP address to set up the Kafka instance though.

`MY_IP=192.168.178.55 docker-compose up -d`
