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

## TODO

Next

- [x] remove request response inside of playcard, hire worker, etc. These are all known quantities and can be done optimistically
- [ ] route requests to local or remote server depending on mode (stored in game state)
- [x] refactor shuffle function
- [ ] refactor payment function (worker vs factory)
- [ ] split out server requests/validation into separate files

Integrating the server side tasks

- [ ] sort out server request/response issue. It should only return valid/invalid, and rollback if invalid. Ideally, when working locally vs remotely, it should call the same service.
- [ ] allow multiple players in clientside types/architecture
- [ ] allow serverside verification/checkpoints/reversions
- [ ] ensuring clear separation of server and client
- [ ] allow hidden information from other players, and the server (ie when drawing cards/shuffle deck)
- [ ] convert from server state to point in time client state

Also, there are some quality of life tasks:

- [x] pull game options into a config (suns require for market, victory building count, starting cost, starting cards, etc.)
- [ ] tests
- [ ] refactoring player actions into separate files
- [ ] abstract card shuffle to separate function
- [ ] avoid mutation where possible (although it might make sense in some places, when transferring into Vue)
- [ ] production is complicated, there might be a better way of doing it (the loops and mutations aren't nice)

And laborious tasks:

- [ ] add all the cards from the game
- [ ] add all the workers to the game
- [ ] add all the resource types to the game

And the final TODO:

- [ ] translate the CLI into the real client, with a websocket architecture and multiple players
