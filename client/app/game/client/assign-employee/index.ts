import {
  GameState,
  PlayerState,
  ProductionEfficiency,
  Employee,
  AssignedEmployee,
  Card,
} from "../../types";

export async function assignEmployee(
  gameState: GameState,
  playerState: PlayerState,
  {employee, efficiency, factory}: {
    employee: Employee,
    efficiency: ProductionEfficiency,
    factory: Card
},
): Promise<AssignedEmployee> {
  
  const assignedEmployee: AssignedEmployee = {
    assignment: factory,
    name: employee.name,
    mode: efficiency,
    unassignmentCost: employee.unassignmentCost,
  };
  playerState.assignedEmployees.push(assignedEmployee);

  return assignedEmployee
}
