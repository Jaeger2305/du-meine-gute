import { LogLevel, ServerActionResponse } from "../types";
import { AssignedEmployee, GameState, PlayerState } from "../../types";

export function assignEmployee(
  serverState: GameState,
  playerNumber: PlayerState["playerNumber"],
  assignedEmployee: AssignedEmployee
): ServerActionResponse {
  serverState.players[playerNumber].assignedEmployees.push(assignedEmployee);

  return {
    type: null,
    isOK: true,
    logLevel: LogLevel.Info,
    response: {},
  };
}
