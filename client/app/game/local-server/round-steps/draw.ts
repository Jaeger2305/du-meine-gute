import { sum } from "lodash";
import { playerActions } from "../../client";
import { GameState, PlayerState } from "../../types";
import { ServerResponse } from "../types";

/**
 * Returns valid actions that can be performed, which is drawing 3 cards.
 * After drawing, the user is allowed to discard 2 cards as well, but that's appended after completing the drawing.
 */
export function draw(
  gameState: GameState,
  playerState: PlayerState
): ServerResponse {
  const drawCardCount =
    gameState.config.drawCount +
    sum(
      playerState.cardsInPlay.map((card) => card.boostDrawCount).filter(Boolean)
    );
  const drawCardActions = new Array(drawCardCount).fill(playerActions.drawCard);
  playerState.availableActions = [...drawCardActions, playerActions.endStep];
  return {
    response: {
      availableActions: playerState.availableActions,
    },
  };
}
