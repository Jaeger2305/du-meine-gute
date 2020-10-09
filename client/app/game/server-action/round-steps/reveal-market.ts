import { drawFromDeck } from "../../utils";
import {
  GameState,
  PlayerState,
  Card,
  PlayerActionEnum,
  ServerActionEnum,
} from "../../types";
import { ServerActionResponse } from "../types";

/**
 * Called twice, once before assigning workers and once after.
 * Resources are revealed from the deck until 3 cards with suns are drawn.
 * Returns valid actions that can be performed, specific for this round.
 * This is normally just an acknowledgement, as the players can't choose anything here.
 */
export function revealMarket(
  gameState: GameState,
  playerState: PlayerState
): ServerActionResponse {
  playerState.availableActions = [PlayerActionEnum.endStep];

  const marketCards: Array<Card> = [];

  // Draw cards until 3 suns.
  while (
    marketCards.filter((card) => card.isSunny).length <
      gameState.config.marketSuns &&
    (gameState.cardsInDeck.length || gameState.cardsInDiscard.length)
  ) {
    const drawnCard = drawFromDeck(
      gameState.cardsInDeck,
      gameState.cardsInDiscard
    );
    marketCards.push(drawnCard);
  }
  gameState.marketCards.push(...marketCards);

  return {
    type: ServerActionEnum.revealMarket,
    isOK: true,
    response: {
      drawnCards: marketCards,
      availableActions: playerState.availableActions,
      marketCards: gameState.marketCards,
    },
  };
}
