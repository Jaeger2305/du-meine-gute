import {
  GameState,
  PlayerState,
  AssignedEmployee,
  Resource,
} from "../../types";
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
