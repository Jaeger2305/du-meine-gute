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
import { unassignWorker as clientUnassignWorker } from "./unassign-employee-utils";
import { unassignWorker as serverUnassignWorker } from "../../local-server/actions/unassign-worker";

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
    ? await prompts({
        type: "multiselect",
        message: `pick resources to spend`,
        name: "resources",
        choices: playerState.resources
          .map((resource, index) => ({
            title: `${resource.type} - ${resource.value}`,
            value: { ...resource, originalIndex: index },
          }))
          .filter((resource) => resource.value.value),
      })
    : { resources: [] };

  // Verify resources are not under or wasted
  if (
    !verifyResources(
      resourcesChoice.resources,
      employeeChoice.employee.unassignmentCost
    )
  )
    return;

  // Notify to server
  serverUnassignWorker(
    gameState,
    playerState,
    employeeChoice.employee,
    resourcesChoice.resources
  );

  // Optimistically update client state
  clientUnassignWorker(
    gameState,
    playerState,
    employeeChoice.employee,
    resourcesChoice.resources
  );
}
