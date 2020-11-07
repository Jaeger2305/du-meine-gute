import { sum } from "lodash";
import {
  GameState,
  PlayerActionEnum,
  ServerActionEnum,
} from "../../types";
import { ServerActionResponse } from "../types";

/**
 * Returns valid actions that can be performed, which is drawing 3 cards.
 * After drawing, the user is allowed to discard 2 cards as well, but that's appended after completing the drawing.
 */
export function drawStep(
  serverState: GameState,
  playerNumber: number
): ServerActionResponse {
  const drawCardCount =
  serverState.config.drawCount +
    sum(
      serverState.players[playerNumber].cardsInPlay.map((card) => card.boostDrawCount).filter(Boolean)
    );
  const drawCardActions = new Array(drawCardCount).fill(
    PlayerActionEnum.drawCard
  );
  serverState.players[playerNumber].availableActions = [...drawCardActions, PlayerActionEnum.endStep];
  return {
    type: ServerActionEnum.drawStep,
    isOK: true,
    response: {
      availableActions: serverState.players[playerNumber].availableActions
    },
  };
}
