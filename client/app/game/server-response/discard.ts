import { DiscardResponse } from "../server-action/types";
import { GameState, PlayerState } from "../types";
import { assignUnknownCard } from "../utils";

export function discard(
  gameState: GameState,
  playerState: PlayerState,
  { drawnCards, cardsInDiscard, cardsInDeck }: DiscardResponse["response"]
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
  drawnCards.forEach((drawnCard) => {
    assignUnknownCard(drawnCard, playerState.cardsInHand);
  });
}
