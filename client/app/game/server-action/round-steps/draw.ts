import { sum } from "lodash";
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
export function draw(
  gameState: GameState,
  playerState: PlayerState
): ServerActionResponse {
  const drawCardCount =
    gameState.config.drawCount +
    sum(
      playerState.cardsInPlay.map((card) => card.boostDrawCount).filter(Boolean)
    );
  const drawCardActions = new Array(drawCardCount).fill(
    PlayerActionEnum.drawCard
  );
  playerState.availableActions = [...drawCardActions, PlayerActionEnum.endStep];
  return {
    type: ServerActionEnum.drawCard,
    isOK: true,
    response: {
      availableActions: playerState.availableActions,
    },
  };
}
