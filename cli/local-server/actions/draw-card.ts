import { ServerResponse } from "../types";
import {
  drawFromDeck,
  removeActionFromAvailableActions,
} from "../../game/utils";
import { GameState, PlayerActionEnum, PlayerState } from "../../types";

/**
 * Reveals a card from the deck after the user has requested drawing a card.
 * Returns the function to update the client game state
 */
export function drawCard(
  gameState: GameState,
  playerState: PlayerState
): ServerResponse {
  // If network game, submit the socket and return.
  // this.gameSocket.send("drawCard")

  // Draw the card
  const drawnCard = drawFromDeck(
    gameState.cardsInDeck,
    gameState.cardsInDiscard
  );
  if (drawnCard) playerState.cardsInHand.splice(0, 0, drawnCard);

  // Find the event and delete it
  removeActionFromAvailableActions(playerState, PlayerActionEnum.drawCard);

  // Send the response back
  const response = {
    drawnCard,
    cardsInDiscard: gameState.cardsInDiscard,
    cardsInDeck: gameState.cardsInDeck,
    cardsInHand: playerState.cardsInHand,
  };
  return {
    response,
  };
}
