import * as prompts from "prompts";
import {
  AssignedEmployee,
  GameState,
  PlayerActionEnum,
  PlayerState,
  Resource,
} from "../../types";
import {
  filterCardsToAffordable,
  removeActionFromAvailableActions,
  verifyResources,
} from "../utils";
import { unassignWorker as serverUnassignWorker } from "../../local-server";

export async function unassignEmployee(
  gameState: GameState,
  playerState: PlayerState
): Promise<void> {
  // Filter employees to an affordable list
  const affordableUnassignments = filterCardsToAffordable<AssignedEmployee>(
    playerState.assignedEmployees,
    (card: AssignedEmployee) => card.unassignmentCost,
    playerState.resources
  );

  // Return early and remove action if no affordable assigned employees
  if (!affordableUnassignments.length)
    return removeActionFromAvailableActions(
      playerState,
      PlayerActionEnum.unassignEmployee
    );

  // Ask which employee to unassign
  const employeeChoice: { employee: AssignedEmployee } = await prompts({
    type: "select",
    message: `pick a worker to unassign`,
    name: "employee",
    choices: affordableUnassignments.map((employee) => ({
      title: employee.name,
      value: employee,
    })),
  });

  // Ask to pay for unassignment, if there's a cost
  const resourcesChoice: {
    resources: Array<Resource & { index: number }>;
  } = employeeChoice.employee.unassignmentCost
    ? { resources: [] }
    : await prompts({
        type: "multiselect",
        message: `pick resources to spend`,
        name: "resources",
        choices: playerState.resources
          .map((resource, index) => ({
            title: `${resource.type} - ${resource.value}`,
            value: { ...resource, originalIndex: index },
          }))
          .filter((resource) => resource.value),
      });

  // Verify resources are not under or wasted
  if (
    !verifyResources(
      resourcesChoice.resources,
      employeeChoice.employee.unassignmentCost
    )
  )
    return;

  // Submit to server
  const {
    response: { assignedEmployees, availableActions, resources },
  } = serverUnassignWorker(
    gameState,
    playerState,
    employeeChoice.employee,
    resourcesChoice.resources
  );

  // Update state with results
  // We should probably optimistically update, and if the response doesn't match, throw an error and restore from state.
  playerState.assignedEmployees = assignedEmployees;
  playerState.availableActions = availableActions;
  playerState.resources = resources;
}
