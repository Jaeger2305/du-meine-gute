import { DrawCardResponse } from "../server-action/types";
import { GameState, PlayerState } from "../types";
import { assignUnknownCard } from "../utils";

export function drawCard(
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
  assignUnknownCard(drawnCard, playerState.cardsInHand);
}
