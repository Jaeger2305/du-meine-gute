import { EndStepResponse, LogLevel } from "../types";
import { RoundSteps } from "..";
import { GameState, ServerActionEnum, PlayerState } from "../../types";
import { PlayerActionEnum } from "../../client";

/**
 * Reveals a card from the deck after the user has requested drawing a card.
 * Returns the function to update the client game state
 * The gameState or playerState should not be modified here.
 */
export function endStep(
  serverState: GameState,
  playerNumber: PlayerState["playerNumber"]
): EndStepResponse {
  // Actual update
  serverState.players[playerNumber].availableActions.splice(
    0,
    serverState.players[playerNumber].availableActions.length,
    PlayerActionEnum.endStep
  );

  serverState.activeStep = (serverState.activeStep + 1) % RoundSteps.length;

  // In multiple player games, we wouldn't immediately populate the available actions. But we're not there yet, so immediately send back the next round.
  // This explains why the roundsteps are actions, but actions that are only called from this action.
  // Eventually, calling end step will mark a player as ready, and when all players are ready, the next step action will be triggered.
  // const roundStepResponse = roundSteps[serverState.activeStep](serverState, playerNumber)

  // Send the response back
  return {
    type: ServerActionEnum.endStep,
    isOK: true,
    logLevel: LogLevel.Info,
    response: {
      activeStep: serverState.activeStep,
      availableActions: serverState.players[playerNumber].availableActions,
    },
  };
}
