import { DrawCardResponse, LogLevel } from "../types";
import { drawFromDeck, obfuscateDeck } from "../../utils";
import { GameState, ServerActionEnum, PlayerState } from "../../types";

/**
 * Reveals a card from the deck after the user has requested drawing a card.
 * Returns the function to update the client game state
 * The gameState or playerState should not be modified here.
 */
export function drawCard(
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
    logLevel: LogLevel.Visible,
    response: {
      drawnCard,
      cardsInDiscard: serverState.cardsInDiscard,
      cardsInDeck: obfuscateDeck(serverState.cardsInDeck),
    },
  };
}
