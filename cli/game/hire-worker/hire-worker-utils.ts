import { playerActions } from "..";
import { Employee, GameState, PlayerState, Resource } from "../../types";
import { spendResources } from "../utils";

/**
 * Puts a card from the available worker pool into the employees of a user.
 * Returns the function to update the client game state
 */
export function payForWorker(
  { availableEmployees, reservedCards, cardsInDiscard }: GameState,
  { employees, resources, availableActions }: PlayerState,
  worker: Employee,
  resourcePayment: Array<Resource>
): void {
  const employeeIndex = availableEmployees.findIndex(
    (availableWorker) => availableWorker.name === worker.name
  );
  const hiredEmployee = availableEmployees.splice(employeeIndex, 1);
  employees.push(...hiredEmployee);

  spendResources(reservedCards, cardsInDiscard, resources, resourcePayment);

  // Delete all events other than the end step
  availableActions.splice(0, availableActions.length, playerActions.endStep);
}
