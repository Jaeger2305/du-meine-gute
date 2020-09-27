import * as prompts from "prompts";
import { newGame } from "./game";
import { setupGame, roundSteps } from "./local-server";
import { RoundSteps } from "./types";
async function main() {
  // Setup the game
  const game = newGame();

  // For the CLI variant, we're modifying the game directly.
  // Inside of Vue, we'll be updating this via props and events.
  setupGame(game);

  // Start the game loop, finishing when there's a winner.
  // In the web version, this will be triggered via websocket messages rather than a single loop.

  let step = 0; // Used to track the expected response from the server.

  // While there is an available action, wait for that input.
  // This is to mock the asynchronous operations available to the user.
  while (game.availableActions.length) {
    // console.clear();
    console.log("starting step", RoundSteps[(step - 1) % roundSteps.length]);
    console.log(`Game state: `, game);
    // Wait for user input
    const chosenAction = await prompts({
      type: "select",
      message: `pick an action to perform`,
      name: "handler",
      choices: game.availableActions.map((a) => ({
        title: a.type,
        value: a.handler,
      })),
    });

    // Perform the action
    console.log("performing chosen action", chosenAction);
    await chosenAction.handler(game);

    // Wait for server response
    // Local only
    // If there are no available actions, we're waiting for input from the server
    // In the case of a local game, we just progress to the next step in the round
    // Currently, this assumes when there are no available actions, we're just waiting for a response.
    if (!game.availableActions.length) {
      const serverResponse = roundSteps[step++ % roundSteps.length](game);
      console.debug(serverResponse);
    }
  }
  process.exit();
}

main();
