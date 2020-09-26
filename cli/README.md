# Du Meine Gute CLI

The game, but in the shape of a CLI.

This helps with shortening the testing loop on the main game logic.

## Structure

There are 2 folders, supposed to represent the distinction between client and server.

There is no multiplayer setup for this cycle, only a single player variant.

The Game object is therefore drastically simplified, and doesn't have the same security checks. This is kept in memory.

Inside the game folder, there is a loop waiting for user input.

## The game loop

Once the CLI starts, the server populates it with available actions for the player to take.

Each player action is configured by the current gameState, calling the local-server function to modify and sync the state.

When there are no more actions, the server will send more available actions, effectively ticking over to the next round.

The client uses the server response when something is hidden information, like what's in the deck, or another player's hand.

The idea is that the client controls most of the state, and sends messages to sync up to the server.
The server can restore the client in case the connection is dropped.

## TODO

Refactor the actions in to separate files
Check the actions fulfill the game logic. Missing parts include:

- [x] Costing of buildings
- [x] Scoring at end of game
- [x] Implementing hiring workers
- [x] Connecting resources to the deck
- [x] Connecting the market to the deck
- [x] Multiple assignments of workers
- [x] Choose building before actually building it
- [x] Reassigning worker
- [x] handle buildings which provide a permanent boost to draw card
- [x] handle buildings which provide a permanent boost to the market
- [x] filter on buildings which don't produce.
- [x] handle buildings which have flexible input (e.g. glass needs 12 resources of any kind)
- [ ] produce for each advanced resource input
- [ ] initial random allocation of coal mines
- [ ] Discarding cards at the beginning of the round
- [ ] chaining is only possible when using from the hand
- [ ] add an extra round after the game has ended, and allow producing at all factories.
- [ ] purchasing a worker has requirements on top of cost
- [ ] builds cost and victory points need to be separated

Also, there are some quality of life tasks:

- [ ] tests
- [ ] refactoring player actions into separate files
- [ ] ensuring clear separation of server and client
- [ ] avoid mutation where possible (although it might make sense in some places, when transferring into Vue)
- [ ] production is complicated, there might be a better way of doing it (the loops and mutations aren't nice)
- [ ] separating produced goods from base goods
- [ ] pull game options into a config (suns require for market, victory building count, starting cost, starting cards, etc.)

And laborious tasks:

- [ ] add all the cards from the game
- [ ] add all the workers to the game
- [ ] add all the resource types to the game

And the final TODO:

- [ ] translate the CLI into the real client, with a websocket architecture and multiple players
