import { Card, GameState, PlayerState } from "../../types";
import { PlayerActionEnum } from "../../client";
import {
  discardCards,
  drawFromDeck,
  removeActionFromAvailableActions,
} from "../../utils";

export function discard(
  gameState: GameState,
  playerState: PlayerState,
  cardsToDiscard: Array<Card>
) {
  discardCards(cardsToDiscard, playerState.cardsInHand);

  const newCards = cardsToDiscard
    .map(() => drawFromDeck(gameState.cardsInDeck, gameState.cardsInDiscard))
    .filter(Boolean);

  playerState.cardsInHand.push(...newCards);

  // Find the event and delete it
  removeActionFromAvailableActions(playerState, PlayerActionEnum.discard);

  return cardsToDiscard;
}
