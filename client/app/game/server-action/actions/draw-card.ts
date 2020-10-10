import { DrawCardResponse } from "../types";
import { drawFromDeck, removeActionFromAvailableActions } from "../../utils";
import { Card, GameState, ServerActionEnum, PlayerState } from "../../types";
import { unknown } from "../../cards";

/**
 * Reveals a card from the deck after the user has requested drawing a card.
 * Returns the function to update the client game state
 * The gameState or playerState should not be modified here.
 */
export function drawCard(
  gameState: GameState,
  serverState: GameState,
  playerNumber: PlayerState["playerNumber"]
): DrawCardResponse {
  // Draw the card
  const drawnCard = drawFromDeck(
    serverState.cardsInDeck,
    serverState.cardsInDiscard
  );

  if (drawnCard) serverState.players[playerNumber].cardsInHand.push(drawnCard);

  // This is done optimistically on the client, so we don't need to send this info back.
  console.warn(
    "Server isn't managing the available actions, like it should be. This will fail because the game state and server state are out of sync"
  );
  // removeActionFromAvailableActions(
  //   serverState.players[playerNumber],
  //   PlayerActionEnum.drawCard
  // );

  // Send the response back
  return {
    type: ServerActionEnum.drawCard,
    isOK: true,
    response: {
      drawnCard,
      cardsInDiscard: serverState.cardsInDiscard,
      cardsInDeck: obfuscateDeck(serverState.cardsInDeck),
    },
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
