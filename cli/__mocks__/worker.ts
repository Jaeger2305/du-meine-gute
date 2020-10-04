import { bakery, bakeryWithChain, bakeryWithSecondaryChain } from "./card";
import { AssignedEmployee, Employee } from "../types";
import { wood, wheat } from "../resources";

export const defaultAssignedEmployee: AssignedEmployee = {
  name: "defaultAssignedEmployee",
  assignment: bakery,
  mode: {
    productionCount: 1,
    resourceSparingCount: 0,
  },
  unassignmentCost: 0,
};

export const defaultChainedAssignedEmployee: AssignedEmployee = {
  name: "defaultChainedAssignedEmployee",
  assignment: bakeryWithChain,
  mode: {
    productionCount: 1,
    resourceSparingCount: 0,
  },
  unassignmentCost: 0,
};

export const discountedAssignedEmployee: AssignedEmployee = {
  name: "discountedAssignedEmployee",
  assignment: bakery,
  mode: {
    productionCount: 1,
    resourceSparingCount: 1,
  },
  unassignmentCost: 0,
};

export const discountedChainedAssignedEmployee: AssignedEmployee = {
  name: "discountedChainedAssignedEmployee",
  assignment: bakeryWithChain,
  mode: {
    productionCount: 2,
    resourceSparingCount: 1,
  },
  unassignmentCost: 0,
};

export const defaultSecondaryChainedAssignedEmployee: AssignedEmployee = {
  name: "defaultSecondaryChainedAssignedEmployee",
  assignment: bakeryWithSecondaryChain,
  mode: {
    productionCount: 1,
    resourceSparingCount: 0,
  },
  unassignmentCost: 0,
};

export const bossAssigned: AssignedEmployee = {
  name: "bossAssigned",
  assignment: bakery,
  mode: {
    productionCount: 2,
    resourceSparingCount: 0,
  },
  unassignmentCost: 0,
};

export const apprentice: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "apprentice-1",
  resourceSpecialty: [wood],
  cost: 3,
  points: 2,
  unassignmentCost: 2,
};

export const skilledApprentice: Employee = {
  modes: [{ productionCount: 3, resourceSparingCount: 0 }],
  name: "skilled-apprentice-1",
  resourceSpecialty: [wheat],
  cost: 4,
  points: 3,
  unassignmentCost: 2,
};

export const master: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "master-1",
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
  name: "boss-1",
  cost: 0,
  points: 0,
  unassignmentCost: 0,
};
