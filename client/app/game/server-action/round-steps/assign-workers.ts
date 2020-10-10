import {
  GameState,
  PlayerState,
  ServerActionEnum,
  PlayerActionEnum,
} from "../../types";
import { ServerActionResponse } from "../types";

/**
 * Initiate the assignment step in the round
 * The returns valid actions that can be performed specific for this round.
 */
export function assignWorkers(
  gameState: GameState,
  serverState: GameState,
  playerNumber: number
): ServerActionResponse {
  console.warn(
    "the server actions aren't really used in any meaningful way, but will be good for validation purposes, and rollback"
  );
  serverState.players[playerNumber].availableActions = [
    PlayerActionEnum.reserveFactory,
    PlayerActionEnum.endStep,
  ];
  return {
    type: ServerActionEnum.assignWorkers,
    isOK: true,
    response: {},
  };
}
