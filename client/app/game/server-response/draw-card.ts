import { DrawCardResponse } from "../server-action/types";
import {
    BuildingType,
    GameState,
    PlayerState,
  } from "../types";

export function drawCard (
  gameState: GameState,
  playerState: PlayerState,
  { drawnCard, cardsInDiscard, cardsInDeck }: DrawCardResponse["response"]
): void {
  if (gameState.cardsInDiscard.length !== cardsInDiscard.length) {
    gameState.cardsInDiscard.splice(
      0,
      gameState.cardsInDiscard.length,
      ...cardsInDiscard
    );
  }
  if (gameState.cardsInDeck.length !== cardsInDeck.length) {
    gameState.cardsInDeck.splice(
      0,
      gameState.cardsInDeck.length,
      ...cardsInDeck
    );
  }
  const unknownCard = playerState.cardsInHand.find(
    (card) => card.type === BuildingType.unknown
  );
  if (!unknownCard) {
    throw new Error(
      "An unknown card was expected here to populate - maybe it already completed."
    );
  }
  Object.assign(unknownCard, drawnCard);
};