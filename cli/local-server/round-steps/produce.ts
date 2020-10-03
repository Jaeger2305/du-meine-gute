import { playerActions } from "../../game";
import { GameState, PlayerState } from "../../types";
import { ServerResponse } from "../types";

/**
 * Initiate the production step in the round
 * Pick one of the assigned workers to produce at that factory.
 * Starting production requires having access to the resource required for its production
 * If the primary worker, one resource can be omitted, but it means only 1 good is produced.
 * This is decided during the assign workers phase.
 *
 * Returns the valid actions that can be performed specific for this round.
 * This includes
 *  - produceAtFactory (for each factory with a worker assigned)
 */
export function produce(
  gameState: GameState,
  playerState: PlayerState
): ServerResponse {
  playerState.availableActions = [
    playerActions.produceAtFactory,
    playerActions.endStep,
  ];
  return {
    response: {
      availableActions: playerState.availableActions,
    },
  };
}
