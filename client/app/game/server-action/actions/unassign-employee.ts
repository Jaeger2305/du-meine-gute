import { ServerActionResponse } from "../types";
import { AssignedEmployee, GameState, PlayerState } from "../../types";

export function unassignEmployee(
  serverState: GameState,
  playerNumber: PlayerState["playerNumber"],
  nameOfEmployeeToUnassign: AssignedEmployee["name"]
): ServerActionResponse {
  console.warn("no validation done here");

  const assignedEmployeeIndexToRemove = serverState.players[
    playerNumber
  ].assignedEmployees.findIndex(
    ({ name: assignedEmployeeName }) =>
      assignedEmployeeName === nameOfEmployeeToUnassign
  );

  serverState.players[playerNumber].assignedEmployees.splice(
    assignedEmployeeIndexToRemove,
    1
  );

  return {
    type: null,
    isOK: true,
    response: {},
  };
}
