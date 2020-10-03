import { GameState, PlayerState, Card } from "../../types";
import { ServerResponse } from "../types";

export function reserveFactory(
  gameState: GameState,
  playerState: PlayerState,
  factory: Card
): ServerResponse {
  console.warn("No validation of build factory by the server");
  return {
    response: { isOK: true },
  };
}
