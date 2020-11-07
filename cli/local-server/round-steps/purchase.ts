import { playerActions } from "../../game";
import { GameState, PlayerState } from "../../types";
import { ServerResponse } from "../types";

/**
 * Initiate the purchase step in the round
 * Starting production requires having access to the resource required for its production
 * If the primary worker, one resource can be omitted, but it means only 1 good is produced.
 * This is decided during the assign workers phase.
 *
 * Returns the valid actions that can be performed specific for this round.
 * This could include hiring a worker, building a factory, or skipping
 */
export function purchase(
  gameState: GameState,
  playerState: PlayerState
): ServerResponse {
  playerState.availableActions = [
    playerActions.hireWorker,
    playerActions.unassignEmployee,
    playerActions.buildFactory,
    playerActions.endStep,
  ];
  return {
    response: {
      availableActions: playerState.availableActions,
    },
  };
}
