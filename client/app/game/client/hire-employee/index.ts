import { removeActionFromAvailableActions, spendResources } from "../../utils";
import { Employee, GameState, PlayerState } from "../../types";
import { Resource } from "../../resources";
import { PlayerActionEnum } from "..";

export function hireEmployee(
  gameState: GameState,
  playerState: PlayerState,
  {
    employee,
    resourcePayment,
  }: {
    employee: Employee;
    resourcePayment: Array<Resource>;
  }
): {
  employeeToHireName: Employee["name"];
  resourcePayment: Array<Resource>;
} {
  // Optimistically update the game state
  const indexEmployeeToHire = gameState.availableEmployees.findIndex(
    ({ name }) => name === employee.name
  );
  const employeeToHire = gameState.availableEmployees.splice(
    indexEmployeeToHire,
    1
  )[0];
  playerState.employees.push(employeeToHire);

  spendResources(
    gameState.reservedCards,
    gameState.cardsInDiscard,
    playerState.resources,
    resourcePayment
  );

  removeActionFromAvailableActions(playerState, PlayerActionEnum.hireEmployee);

  // Return the info needed for the server update
  return {
    employeeToHireName: employeeToHire.name,
    resourcePayment,
  };
}
