import { RevealMarketResponse } from "../server-action/types";
import { GameState, PlayerState } from "../types";

export function revealMarket(
  gameState: GameState,
  playerState: PlayerState,
  { drawnCards, cardsInDiscard, cardsInDeck }: RevealMarketResponse["response"]
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
  gameState.marketCards.push(...drawnCards);
}
