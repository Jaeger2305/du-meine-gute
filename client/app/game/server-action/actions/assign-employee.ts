import { ServerActionResponse } from "../types";
import { AssignedEmployee, Card, Employee, GameState, PlayerState, ProductionEfficiency } from "../../types";

export function assignEmployee(
  serverState: GameState,
  playerNumber: PlayerState["playerNumber"],
  assignedEmployee: AssignedEmployee
): ServerActionResponse {
  serverState.players[playerNumber].assignedEmployees.push(assignedEmployee)

  return {
    type: null,
    isOK: true,
    response: {},
  };
}
