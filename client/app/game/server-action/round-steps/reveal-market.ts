import { drawFromDeck } from "../../utils";
import {
  GameState,
  Card,
  ServerActionEnum,
} from "../../types";
import { PlayerActionEnum } from "../../client";
import { ServerActionResponse } from "../types";

/**
 * Called twice, once before assigning workers and once after.
 * Resources are revealed from the deck until 3 cards with suns are drawn.
 * Returns valid actions that can be performed, specific for this round.
 * This is normally just an acknowledgement, as the players can't choose anything here.
 */
export function revealMarket(
  serverState: GameState,
  playerNumber: number
): ServerActionResponse {
  const playerState = serverState.players[playerNumber]
  playerState.availableActions = [PlayerActionEnum.endStep];

  const marketCards: Array<Card> = [];

  // Draw cards until 3 suns.
  while (
    marketCards.filter((card) => card.isSunny).length <
      serverState.config.marketSuns &&
    (serverState.cardsInDeck.length || serverState.cardsInDiscard.length)
  ) {
    const drawnCard = drawFromDeck(
      serverState.cardsInDeck,
      serverState.cardsInDiscard
    );
    marketCards.push(drawnCard);
  }
  serverState.marketCards.push(...marketCards);

  return {
    type: ServerActionEnum.revealMarket,
    isOK: true,
    response: {
      drawnCards: marketCards,
    },
  };
}
