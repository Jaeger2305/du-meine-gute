import { GameState, PlayerState, Resource } from "../../types";
import { ServerResponse } from "../types";

/**
 * Puts a card from a players hand into play.
 * Returns the function to update the client game state
 */
export function buildFactory(
  gameState: GameState,
  playerState: PlayerState,
  resources: Array<Resource>
): ServerResponse {
  console.warn("No validation of build factory by the server");
  return {
    response: { isOK: true },
  };
}
