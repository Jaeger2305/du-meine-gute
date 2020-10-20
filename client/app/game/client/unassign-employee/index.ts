import { GameState, PlayerState, AssignedEmployee } from "../../types";

export function unassignEmployee(
  gameState: GameState,
  playerState: PlayerState,
  nameOfEmployeeToUnassign: AssignedEmployee["name"]
): AssignedEmployee["name"] {
  const assignedEmployeeIndexToRemove = playerState.assignedEmployees.findIndex(
    ({ name: assignedEmployeeName }) =>
      assignedEmployeeName === nameOfEmployeeToUnassign
  );

  if (assignedEmployeeIndexToRemove < 0)
    throw new Error("there should be an employee here.");

  playerState.assignedEmployees.splice(assignedEmployeeIndexToRemove, 1);

  return nameOfEmployeeToUnassign;
}
