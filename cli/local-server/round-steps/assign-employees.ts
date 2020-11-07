import { playerActions } from "../../game";
import { GameState, PlayerState } from "../../types";
import { ServerResponse } from "../types";

/**
 * Initiate the assignment step in the round
 * The returns valid actions that can be performed specific for this round.
 */
export function assignEmployees(
  gameState: GameState,
  playerState: PlayerState
): ServerResponse {
  playerState.availableActions = [
    playerActions.assignEmployee,
    playerActions.reserveFactory,
    playerActions.endStep,
  ];
  return {
    response: {
      availableActions: playerState.availableActions,
    },
  };
}
