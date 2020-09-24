import * as prompts from "prompts";
import {
  GameState,
  ProductionEfficiency,
  PlayerActionEnum,
  Employee,
  AssignedEmployee,
  Card,
} from "../../types";
import { assignEmployee as serverAssignEmployee } from "../../local-server";
import { removeActionFromAvailableActions } from "../utils";

function getUnassignedEmployees(
  employees: Array<Employee>,
  assignedEmployees: Array<AssignedEmployee>
): Array<Employee> {
  return employees.filter(
    (employee) =>
      !assignedEmployees
        .map((assignedEmployee) => assignedEmployee.name)
        .includes(employee.name)
  );
}

function getUnoccupiedFactories(
  assignedEmployees: Array<AssignedEmployee>,
  factories: Array<Card>
): Array<Card> {
  return factories.filter(
    (factory) =>
      !assignedEmployees
        .map((assignedEmployee) => assignedEmployee.assignment.name)
        .includes(factory.name)
  );
}

export async function assignEmployee(gameState: GameState): Promise<void> {
  // Filter the employees to those that haven't been assigned yet.
  const unassignedEmployees = getUnassignedEmployees(
    gameState.employees,
    gameState.assignedEmployees
  );

  const unoccupiedFactories = getUnoccupiedFactories(
    gameState.assignedEmployees,
    gameState.cardsInPlay
  );

  // Return early if no employees or unoccupied factories, removing the action.
  if (!unassignedEmployees.length || !unoccupiedFactories.length)
    return removeActionFromAvailableActions(
      gameState,
      PlayerActionEnum.assignEmployee
    );

  // Pick an employee to assign
  const employeeChoice = await prompts({
    type: "select",
    message: `pick a worker to assign`,
    name: "employee",
    choices: unassignedEmployees.map((employee) => ({
      title: employee.name,
      value: employee,
    })),
  });

  // Pick the efficiency of the employee, if there are multiple options.
  const efficiencyChoice =
    employeeChoice.employee.modes.length === 1
      ? { mode: employeeChoice.employee.modes[0] }
      : await prompts({
          type: "select",
          message: `pick an efficiency of the worker`,
          name: "mode",
          choices: employeeChoice.employee.modes.map(
            (efficiency: ProductionEfficiency) => ({
              title: `produces: ${efficiency.productionCount}, spares: ${efficiency.resourceSparingCount}`,
              value: efficiency,
            })
          ),
        });

  // Pick the building to assign to
  const cardChoice = await prompts({
    type: "select",
    message: `pick an in-play card to assign the worker`,
    name: "card",
    choices: unoccupiedFactories.map((card) => ({
      title: card.name,
      value: card,
    })),
  });

  // No error checking
  const {
    response: { assignedEmployees },
  } = serverAssignEmployee(
    gameState,
    employeeChoice.employee,
    efficiencyChoice.mode,
    cardChoice.card
  );
  gameState.assignedEmployees = assignedEmployees;

  if (
    !getUnassignedEmployees(gameState.employees, gameState.assignedEmployees)
      .length
  ) {
    return removeActionFromAvailableActions(
      gameState,
      PlayerActionEnum.assignEmployee
    );
  }
}
