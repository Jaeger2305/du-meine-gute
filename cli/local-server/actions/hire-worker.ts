import { GameState, PlayerState, Employee, Resource } from "../../types";
import { ServerResponse } from "../types";

/**
 * Puts a card from the available worker pool into the employees of a user.
 * Returns the function to update the client game state
 */
export function hireWorker(
  gameState: GameState,
  playerState: PlayerState,
  worker: Employee,
  resources: Array<Resource>
): ServerResponse {
  console.warn("No validation of hiring worker");
  return {
    response: { isOK: true },
  };
}
