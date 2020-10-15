import {
  GameState,
  ServerActionEnum,
  PlayerActionEnum,
} from "../../types";
import { ServerActionResponse } from "../types";

/**
 * Initiate the assignment step in the round
 * The returns valid actions that can be performed specific for this round.
 */
export function produceStep(
  serverState: GameState,
  playerNumber: number
): ServerActionResponse {
  console.warn(
    "the server actions aren't really used in any meaningful way, but will be good for validation purposes, and rollback"
  );
  serverState.players[playerNumber].availableActions = [
    PlayerActionEnum.produceAtFactory,
    PlayerActionEnum.endStep,
  ];
  return {
    type: ServerActionEnum.produceStep,
    isOK: true,
    response: {
      availableActions: serverState.players[playerNumber].availableActions
    },
  };
}
