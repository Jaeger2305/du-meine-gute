import { playerActions } from "../../client";
import { GameState, PlayerState } from "../../types";
import { ServerResponse } from "../types";

/**
 * Returns valid actions that can be performed, which is drawing 3 cards.
 * After drawing, the user is allowed to discard 2 cards as well, but that's appended after completing the drawing.
 */
export function startRound(
  gameState: GameState,
  playerState: PlayerState
): ServerResponse {
  playerState.availableActions = [playerActions.endStep];
  gameState.marketCards = [];
  return {
    response: {
      availableActions: playerState.availableActions,
    },
  };
}
