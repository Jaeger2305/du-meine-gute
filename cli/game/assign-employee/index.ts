import * as prompts from "prompts";
import { GameState } from "../../types";
import { assignEmployee as serverAssignEmployee } from "../../local-server";

export async function assignEmployee(gameState: GameState): Promise<void> {
  // pick an employee
  const employeeChoice = await prompts({
    type: "select",
    message: `pick a worker to assign`,
    name: "employee",
    choices: gameState.employees.map((employee) => ({
      title: employee.name,
      value: employee,
    })),
  });

  // Still need to loop over all workers
  // And decide on efficiency

  // Pick the building to choose, based on material speciality (not implemented yet)
  const cardChoice = await prompts({
    type: "select",
    message: `pick an in-play card to assign the worker`,
    name: "card",
    choices: gameState.cardsInPlay.map((card) => ({
      title: card.name,
      value: card,
    })),
  });

  // No error checking
  const {
    response: { availableActions, assignedEmployees },
  } = serverAssignEmployee(gameState, employeeChoice.employee, cardChoice.card);
  gameState.availableActions = availableActions;
  gameState.assignedEmployees = assignedEmployees;
}
