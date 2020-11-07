import { GameState, PlayerState, AssignedEmployee } from "../../types";
import { Resource } from "../../resources";
import { ServerResponse } from "../types";

export function unassignWorker(
  gameState: GameState,
  playerState: PlayerState,
  worker: AssignedEmployee,
  resources: Array<Resource>
): ServerResponse {
  console.warn("No validation of goods production by the server");
  return {
    response: { isOK: true },
  };
}
