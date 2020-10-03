import { ServerResponse } from "../types";
import { GameState, PlayerState, Resource } from "../../types";

export function produceGood(
  gameState: GameState,
  playerState: PlayerState,
  resource: Resource
): ServerResponse {
  console.warn("No validation of goods production by the server");
  return {
    response: { isOK: true },
  };
}
