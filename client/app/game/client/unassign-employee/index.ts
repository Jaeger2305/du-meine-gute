import { removeActionFromAvailableActions, spendResources } from "../../utils";
import { PlayerActionEnum } from "..";
import { Resource } from "../../resources";
import { GameState, PlayerState, AssignedEmployee } from "../../types";

export function unassignEmployee(
  gameState: GameState,
  playerState: PlayerState,
  {
    nameOfEmployeeToUnassign,
    resourcePayment,
  }: {
    nameOfEmployeeToUnassign: AssignedEmployee["name"];
    resourcePayment?: Array<Resource>; // Should this be optional?
  }
): AssignedEmployee["name"] {
  const assignedEmployeeIndexToRemove = playerState.assignedEmployees.findIndex(
    ({ name: assignedEmployeeName }) =>
      assignedEmployeeName === nameOfEmployeeToUnassign
  );

  if (assignedEmployeeIndexToRemove < 0)
    throw new Error("there should be an employee here.");

  if (
    playerState.assignedEmployees[assignedEmployeeIndexToRemove]
      .unassignmentCost
  ) {
    const { reservedCards, cardsInDiscard } = gameState;
    const { resources } = playerState;
    spendResources(reservedCards, cardsInDiscard, resources, resourcePayment);
  }

  playerState.assignedEmployees.splice(assignedEmployeeIndexToRemove, 1);

  // Remove the action if there are no more employees to unassign.
  // Free to remove employees are unassigned at the end of the round regardless.
  if (
    !playerState.assignedEmployees.find(
      ({ unassignmentCost }) => unassignmentCost > 0
    )
  ) {
    removeActionFromAvailableActions(
      playerState,
      PlayerActionEnum.unassignEmployee
    );
  }

  return nameOfEmployeeToUnassign;
}
