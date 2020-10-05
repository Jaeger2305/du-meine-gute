import { ServerResponse } from "../types";
import { drawFromDeck } from "../../../../cli/game/utils";
import { Card, GameState, PlayerState } from "../../../../cli/types";

/**
 * Reveals a card from the deck after the user has requested drawing a card.
 * Returns the function to update the client game state
 */
export function drawCard(
  gameState: GameState,
  playerState: PlayerState,
  unknownCard: Card
): ServerResponse {
  // If network game, submit the socket and return.
  // this.gameSocket.send("drawCard")

  // Draw the card
  const drawnCard = drawFromDeck(
    gameState.cardsInDeck,
    gameState.cardsInDiscard
  );
  if (drawnCard) Object.assign(unknownCard, drawnCard);

  // Send the response back
  const response = { isOK: true };
  return {
    response,
  };
}
