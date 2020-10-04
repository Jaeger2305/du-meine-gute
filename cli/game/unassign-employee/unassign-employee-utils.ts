import { playerActions } from "..";
import {
  AssignedEmployee,
  GameState,
  PlayerState,
  Resource,
} from "../../types";
import { spendResources } from "../utils";

export function unassignWorker(
  { reservedCards, cardsInDiscard }: GameState,
  { resources, availableActions, assignedEmployees }: PlayerState,
  worker: AssignedEmployee,
  resourcePayment: Array<Resource>
): void {
  const employeeIndex = assignedEmployees.findIndex(
    (assignedWorker) => assignedWorker.name === worker.name
  );
  assignedEmployees.splice(employeeIndex, 1);

  spendResources(reservedCards, cardsInDiscard, resources, resourcePayment);

  // Delete all events other than the end step
  availableActions.splice(0, availableActions.length, playerActions.endStep);
}
