import { EndStepResponse } from "../types";
import { roundSteps } from "../round-steps";
import { GameState, ServerActionEnum, PlayerState } from "../../types";

/**
 * Reveals a card from the deck after the user has requested drawing a card.
 * Returns the function to update the client game state
 * The gameState or playerState should not be modified here.
 */
export function endStep(
  gameState: GameState,
  serverState: GameState,
  playerNumber: PlayerState["playerNumber"]
): EndStepResponse {
  // Actual update
  serverState.players[playerNumber].availableActions.splice(
    0,
    serverState.players[playerNumber].availableActions.length
  );

  serverState.activeStep = (serverState.activeStep + 1)  % roundSteps.length

  // In multiple player games, we wouldn't immediately populate the available actions. But we're not there yet, so immediately send back the next round.
  roundSteps[serverState.activeStep](gameState, serverState, playerNumber)

  // Send the response back
  return {
    type: ServerActionEnum.endStep,
    isOK: true,
    response: {
      availableActions: serverState.players[playerNumber].availableActions
    },
  };
}
