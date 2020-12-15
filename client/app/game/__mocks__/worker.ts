import { bakery, bakeryWithChain, bakeryWithSecondaryChain } from "./card";
import { AssignedEmployee, Employee, EmployeeType } from "../types";
import { wood, wheat } from "../resources";

export const defaultAssignedEmployee: AssignedEmployee = {
  name: "defaultAssignedEmployee",
  type: EmployeeType.Banker,
  assignment: bakery,
  mode: {
    productionCount: 1,
    resourceSparingCount: 0,
  },
  unassignmentCost: 0,
  hasProduced: false,
};

export const defaultChainedAssignedEmployee: AssignedEmployee = {
  name: "defaultChainedAssignedEmployee",
  type: EmployeeType.MillOwner,
  assignment: bakeryWithChain,
  mode: {
    productionCount: 1,
    resourceSparingCount: 0,
  },
  unassignmentCost: 0,
  hasProduced: false,
};

export const discountedAssignedEmployee: AssignedEmployee = {
  name: "discountedAssignedEmployee",
  type: EmployeeType.Boss,
  assignment: bakery,
  mode: {
    productionCount: 1,
    resourceSparingCount: 1,
  },
  unassignmentCost: 0,
  hasProduced: false,
};

export const discountedChainedAssignedEmployee: AssignedEmployee = {
  name: "discountedChainedAssignedEmployee",
  type: EmployeeType.Banker,
  assignment: bakeryWithChain,
  mode: {
    productionCount: 2,
    resourceSparingCount: 1,
  },
  unassignmentCost: 0,
  hasProduced: false,
};

export const defaultSecondaryChainedAssignedEmployee: AssignedEmployee = {
  name: "defaultSecondaryChainedAssignedEmployee",
  type: EmployeeType.Boss,
  assignment: bakeryWithSecondaryChain,
  mode: {
    productionCount: 1,
    resourceSparingCount: 0,
  },
  unassignmentCost: 0,
  hasProduced: false,
};

export const bossAssigned: AssignedEmployee = {
  name: "bossAssigned",
  type: EmployeeType.Boss,
  assignment: bakery,
  mode: {
    productionCount: 2,
    resourceSparingCount: 0,
  },
  unassignmentCost: 0,
  hasProduced: false,
};

export const apprentice: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "apprentice-1",
  type: EmployeeType.OfficeApprentice,
  resourceSpecialty: [wood],
  cost: 3,
  points: 2,
  unassignmentCost: 2,
};

export const skilledApprentice: Employee = {
  modes: [{ productionCount: 3, resourceSparingCount: 0 }],
  name: "skilled-apprentice-1",
  type: EmployeeType.OfficeManager,
  resourceSpecialty: [wheat],
  cost: 4,
  points: 3,
  unassignmentCost: 2,
};

export const master: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "master-1",
  type: EmployeeType.Banker,
  resourceSpecialty: [wheat],
  cost: 5,
  points: 4,
  unassignmentCost: 2,
};

export const boss: Employee = {
  modes: [
    { productionCount: 1, resourceSparingCount: 1 },
    { productionCount: 2, resourceSparingCount: 0 },
  ],
  type: EmployeeType.Boss,
  name: "boss-1",
  cost: 0,
  points: 0,
  unassignmentCost: 0,
};
