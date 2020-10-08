import { EndStepResponse } from "../types";
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
  // Testing to troubleshoot issue
  gameState.players[playerNumber].availableActions.splice(
    0,
    gameState.players[playerNumber].availableActions.length
  );

  // Actual update
  serverState.players[playerNumber].availableActions.splice(
    0,
    serverState.players[playerNumber].availableActions.length
  );

  // Send the response back
  return {
    type: ServerActionEnum.endStep,
    isOK: true,
    response: {},
  };
}
