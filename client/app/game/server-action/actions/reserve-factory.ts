import { LogLevel, ServerActionResponse } from "../types";
import { Card, GameState, PlayerState } from "../../types";

/**
 * Reveals a card from the deck after the user has requested drawing a card.
 * Returns the function to update the client game state
 * The gameState or playerState should not be modified here.
 */
export function reserveFactory(
  serverState: GameState,
  playerNumber: PlayerState["playerNumber"],
  factoryToReserve: Card
): ServerActionResponse {
  // Send the response back
  const foundIndex = serverState.players[playerNumber].cardsInHand.findIndex(
    (card) => card.name === factoryToReserve.name
  );
  console.warn("no error handling");
  serverState.players[playerNumber].reservedFactory = serverState.players[
    playerNumber
  ].cardsInHand.splice(foundIndex, 1)[0];

  return {
    type: null,
    isOK: true,
    logLevel: LogLevel.Info,
    response: {},
  };
}
