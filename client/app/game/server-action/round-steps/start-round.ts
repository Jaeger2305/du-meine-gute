import {
  GameState,
  PlayerActionEnum,
  PlayerState,
  ServerActionEnum,
} from "../../types";
import { ServerActionResponse } from "../types";

/**
 * Returns valid actions that can be performed, which is drawing 3 cards.
 * After drawing, the user is allowed to discard 2 cards as well, but that's appended after completing the drawing.
 */
export function startRound(
  gameState: GameState,
  playerState: PlayerState
): ServerActionResponse {
  playerState.availableActions = [PlayerActionEnum.endStep];
  gameState.marketCards = [];
  return {
    type: ServerActionEnum.startRound,
    isOK: true,
    response: {
      availableActions: playerState.availableActions,
    },
  };
}
