import {
  GameState,
  PlayerState,
  ProductionEfficiency,
  Employee,
  AssignedEmployee,
  Card,
} from "../../types";

type AssignmentPayload = {
  employee: Employee;
  efficiency: ProductionEfficiency;
  factory: Card;
};

export async function assignEmployee(
  gameState: GameState,
  playerState: PlayerState,
  { employee, efficiency, factory }: AssignmentPayload
): Promise<AssignedEmployee> {
  const assignedEmployee: AssignedEmployee = {
    assignment: factory,
    name: employee.name,
    type: employee.type,
    mode: efficiency,
    unassignmentCost: employee.unassignmentCost,
    hasProduced: false,
  };
  playerState.assignedEmployees.push(assignedEmployee);

  return assignedEmployee;
}
