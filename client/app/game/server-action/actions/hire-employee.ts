import { ServerActionResponse } from "../types";
import { AssignedEmployee, GameState, PlayerState } from "../../types";
import { Resource } from "../../resources";
import { spendResources, removeActionFromAvailableActions } from "../../utils";
import { PlayerActionEnum } from "../../client";

export function hireEmployee(
  serverState: GameState,
  playerNumber: PlayerState["playerNumber"],
  {
    employeeToHireName,
    resourcePayment,
  }: {
    employeeToHireName: AssignedEmployee["name"];
    resourcePayment?: Array<Resource>;
  }
): ServerActionResponse {
  console.warn("no validation done here");
  const playerState = serverState.players[playerNumber];

  spendResources(
    serverState.reservedCards,
    serverState.cardsInDiscard,
    playerState.resources,
    resourcePayment
  );

  const employeeIndexToRemove = serverState.availableEmployees.findIndex(
    ({ name: availableEmployeeName }) =>
      availableEmployeeName === employeeToHireName
  );

  const employeeBeingHired = serverState.availableEmployees.splice(
    employeeIndexToRemove,
    1
  )[0];

  playerState.employees.push(employeeBeingHired);

  // Only one employee can be hired, so always remove it from the available actions
  removeActionFromAvailableActions(playerState, PlayerActionEnum.hireWorker);

  return {
    type: null,
    isOK: true,
    response: {},
  };
}
