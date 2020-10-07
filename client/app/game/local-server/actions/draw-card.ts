import { ServerResponse } from "../types";
import { drawFromDeck } from "../../utils";
import { Card, GameState, PlayerState } from "../../types";
import { unknown } from "../../cards";

/**
 * Reveals a card from the deck after the user has requested drawing a card.
 * Returns the function to update the client game state
 * The gameState or playerState should not be modified here.
 */
export function drawCard(
  gameState: GameState,
  serverState: GameState,
  playerState: PlayerState
): ServerResponse {
  debugger;
  // Draw the card
  const drawnCard = drawFromDeck(
    serverState.cardsInDeck,
    serverState.cardsInDiscard
  );

  if (drawnCard)
    serverState.players[playerState.playerNumber].cardsInHand.push(drawnCard);

  // Send the response back
  const response = {
    type: "drawCard",
    isOK: true,
    drawnCard,
    cardsInDiscard: serverState.cardsInDiscard,
    cardsInDeck: obfuscateDeck(serverState.cardsInDeck),
  };
  return {
    response,
  };
}

// This should be a shared util function, but quick for now whilst PoC
function createUnknownCard(baseCard: Card = unknown): Card {
  return { ...unknown, ...baseCard };
}

function obfuscateDeck(
  cardsInDeck: GameState["cardsInDeck"]
): GameState["cardsInDeck"] {
  return cardsInDeck.map(createUnknownCard);
}
