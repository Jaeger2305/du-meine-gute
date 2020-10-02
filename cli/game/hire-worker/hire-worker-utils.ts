import { playerActions } from "..";
import { Employee, GameState, PlayerState, Resource } from "../../types";

/**
 * Puts a card from the available worker pool into the employees of a user.
 * Returns the function to update the client game state
 */
export function payForWorker(
  { availableEmployees, reservedCards, cardsInDiscard }: GameState,
  { employees, resources, availableActions }: PlayerState,
  worker: Employee,
  paymentResources: Array<Resource>
): void {
  const employeeIndex = availableEmployees.findIndex(
    (availableWorker) => availableWorker.name === worker.name
  );
  const hiredEmployee = availableEmployees.splice(employeeIndex, 1);
  employees.push(...hiredEmployee);

  // Unreserve cards and put them in the discard
  // The order shouldn't matter - they're unknown to all.
  const usedGoods = reservedCards.splice(0, resources.length);
  cardsInDiscard.push(...usedGoods);

  // Find the resources and delete them.
  // Not efficient. But I'm not sure the server is responsible for this anyway.
  while (paymentResources.length) {
    const resourceBeingDeleted = paymentResources.pop();
    const indexOfResourceToDelete = resources.findIndex(
      (gameResource) => gameResource.type === resourceBeingDeleted.type
    );
    resources.splice(indexOfResourceToDelete, 1);
  }

  // Delete all events other than the end step
  availableActions.splice(0, availableActions.length, playerActions.endStep);
}
