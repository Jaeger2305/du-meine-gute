import {
  GameState,
  ServerActionEnum,
} from "../../types";
import { PlayerActionEnum } from "../../client";
import { ServerActionResponse } from "../types";

/**
 * Returns valid actions that can be performed, which is drawing 3 cards.
 * After drawing, the user is allowed to discard 2 cards as well, but that's appended after completing the drawing.
 */
export function startRound(
  serverState: GameState,
  playerNumber: number
): ServerActionResponse {
  const playerState = serverState.players[playerNumber]
  playerState.availableActions = [PlayerActionEnum.endStep];
  serverState.marketCards = [];
  return {
    type: ServerActionEnum.startRound,
    isOK: true,
    response: {},
  };
}
