import { ServerActionResponse } from "../types";
import { AssignedEmployee, GameState, PlayerState } from "../../types";
import { Resource } from "@/game/resources";
import { spendResources, removeActionFromAvailableActions } from "../../utils";
import { PlayerActionEnum } from "@/game/client";

export function unassignEmployee(
  serverState: GameState,
  playerNumber: PlayerState["playerNumber"],
  {
    nameOfEmployeeToUnassign,
    resourcePayment,
  }: {
    nameOfEmployeeToUnassign: AssignedEmployee["name"];
    resourcePayment?: Array<Resource>;
  }
): ServerActionResponse {
  console.warn("no validation done here");
  const playerState = serverState.players[playerNumber];

  const assignedEmployeeIndexToRemove = playerState.assignedEmployees.findIndex(
    ({ name: assignedEmployeeName }) =>
      assignedEmployeeName === nameOfEmployeeToUnassign
  );

  if (
    playerState.assignedEmployees[assignedEmployeeIndexToRemove]
      .unassignmentCost
  ) {
    const { reservedCards, cardsInDiscard } = serverState;
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

  return {
    type: null,
    isOK: true,
    response: {},
  };
}
