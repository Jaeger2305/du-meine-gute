import { Card, GameState, PlayerState } from "../../types";
import { PlayerActionEnum} from "../../client";
import { unknown } from "../../cards";
import { removeActionFromAvailableActions } from "../../utils";

function createUnknownCard(baseCard: Card = unknown): Card {
  return { ...unknown, ...baseCard };
}

export function drawCard(gameState: GameState, playerState: PlayerState) {
  const unknownCard = createUnknownCard();

  playerState.cardsInHand.push(unknownCard);
  // Find the event and delete it
  removeActionFromAvailableActions(playerState, PlayerActionEnum.drawCard);
}
