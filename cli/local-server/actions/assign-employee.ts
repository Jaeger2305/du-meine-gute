import {
  GameState,
  PlayerState,
  Employee,
  ProductionEfficiency,
  Card,
} from "../../types";
import { ServerResponse } from "../types";

/**
 * Initiate the assignment step in the round
 * The returns valid actions that can be performed specific for this round.
 */
export function assignEmployee(
  gameState: GameState,
  playerState: PlayerState,
  employee: Employee,
  mode: ProductionEfficiency,
  factory: Card
): ServerResponse {
  // Validate action
  console.warn("No validation of assignment");

  return {
    response: {
      isOK: true,
    },
  };
}
