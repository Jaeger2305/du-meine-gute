import { playerActions } from "..";
import {
  AssignedEmployee,
  GameState,
  PlayerState,
  Resource,
} from "../../types";

export function unassignWorker(
  gameState: GameState,
  playerState: PlayerState,
  worker: AssignedEmployee,
  resources: Array<Resource>
): void {
  const employeeIndex = playerState.assignedEmployees.findIndex(
    (assignedWorker) => assignedWorker.name === worker.name
  );
  playerState.assignedEmployees.splice(employeeIndex, 1);

  // Unreserve cards and put them in the discard
  // The order shouldn't matter - they're unknown to all.
  const usedGoods = gameState.reservedCards.splice(0, resources.length);
  gameState.cardsInDiscard.push(...usedGoods);

  // Find the resources and delete them.
  // Not efficient. But I'm not sure the server is responsible for this anyway.
  while (resources.length) {
    const resourceBeingDeleted = resources.pop();
    const indexOfResourceToDelete = playerState.resources.findIndex(
      (gameResource) => gameResource.type === resourceBeingDeleted.type
    );
    playerState.resources.splice(indexOfResourceToDelete, 1);
  }

  // Delete all events other than the end step
  playerState.availableActions = [playerActions.endStep];

  const response = {
    assignedEmployees: playerState.assignedEmployees,
    availableActions: playerState.availableActions,
    resources: playerState.resources,
  };
}
