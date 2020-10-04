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

Each player action is configured by the current gameState, this is optimistically mutating the data on the client side.

When there are no more actions, the server will send more available actions, effectively ticking over to the next round.

The client should use or await the server response when something is hidden information, like what's in the deck, or another player's hand.

The idea is that the client controls most of the state, and sends messages to sync up to the server / communicate those updates to other players
In case of connection dropping, or failed validation, the server can restore the client and dismiss any messages sent after the point of failure.

## Mocking message queue

A set timeout which uses a callback to update the state should mock the asynchronous nature, allowing for testing of hidden information like drawing a card.

This callback is exactly what would be called by an onmessage event for the client's websocket

The vast majority of requests can be done optimistically. The trickier ones are those with imperfect information.

## TODO

Next

- Begin integration into app

Integrating the server side tasks

- [ ] sort out server request/response issue. It should only return valid/invalid, and rollback if invalid. Ideally, when working locally vs remotely, it should call the same service.
- [ ] allow multiple players in clientside types/architecture
- [ ] allow serverside verification/checkpoints/reversions
- [ ] ensuring clear separation of server and client
- [ ] convert from server state to point in time client state

Also, there are some quality of life tasks:

- [x] pull game options into a config (suns require for market, victory building count, starting cost, starting cards, etc.)
- [ ] tests
- [ ] refactoring player actions into separate files
- [ ] avoid mutation where possible (although it might make sense in some places, when transferring into Vue)
- [ ] production is complicated, there might be a better way of doing it (the loops and mutations aren't nice)

And the final TODO:

- [ ] translate the CLI into the real client, with a websocket architecture and multiple players
