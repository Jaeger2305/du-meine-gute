import { Employee } from "../types";
import { wood, wool, brick, wheat, metal } from "../resources";
import { builtinModules } from "module";
import { shuffle } from "lodash";

// Employees

const actor: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "actor",
  resourceSpecialty: [wood, wool, wool],
  cost: 6,
  points: 3,
  unassignmentCost: 2,
};

const banker: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "banker",
  resourceSpecialty: [brick, wood, metal, metal],
  cost: 6,
  points: 3,
  unassignmentCost: 2,
};

const brickLayer: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "brick-layer",
  resourceSpecialty: [brick, brick],
  cost: 4,
  points: 2,
  unassignmentCost: 2,
};

const builder: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "builder",
  resourceSpecialty: [brick, brick, brick, brick],
  cost: 2,
  points: 3,
  unassignmentCost: 2,
};

const farmhand: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "farmhand",
  resourceSpecialty: [wheat, wheat, wheat, wheat],
  cost: 3,
  points: 2,
  unassignmentCost: 2,
};

const forester: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "forester",
  resourceSpecialty: [wood, wood, wood, wood],
  cost: 2,
  points: 3,
  unassignmentCost: 2,
};

const millOwner: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "mill-owner",
  resourceSpecialty: [wheat, wheat, metal],
  cost: 6,
  points: 3,
  unassignmentCost: 2,
};

const officeApprentice: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "office-apprentice",
  resourceSpecialty: [metal, metal, metal],
  cost: 3,
  points: 2,
  unassignmentCost: 2,
};

const officeManager: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "office-manager",
  resourceSpecialty: [metal, metal],
  cost: 4,
  points: 2,
  unassignmentCost: 2,
};

const overseer: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "overseer",
  resourceSpecialty: [wool, metal, brick, wood, wheat],
  cost: 2,
  points: 3,
  unassignmentCost: 2,
};

const sawmillManager: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "sawmill-manager",
  resourceSpecialty: [wood, wood],
  cost: 4,
  points: 2,
  unassignmentCost: 2,
};

const shopOwner: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "shop-owner",
  resourceSpecialty: [wood, wool, metal, metal],
  cost: 2,
  points: 3,
  unassignmentCost: 2,
};

const supervisor: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "supervisor",
  resourceSpecialty: [wool, brick, wood, wheat],
  cost: 4,
  points: 3,
  unassignmentCost: 2,
};

const tailor: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "tailor",
  resourceSpecialty: [wool, wool],
  cost: 4,
  points: 2,
  unassignmentCost: 2,
};

const weaver: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "weaver",
  resourceSpecialty: [wool, wool, wool, wool],
  cost: 2,
  points: 3,
  unassignmentCost: 2,
};

export function seedWorkers(count): Array<Employee> {
  const allWorkers = [
    actor,
    banker,
    brickLayer,
    builder,
    farmhand,
    forester,
    millOwner,
    officeApprentice,
    officeManager,
    overseer,
    sawmillManager,
    shopOwner,
    supervisor,
    tailor,
    weaver,
  ];

  if (count > allWorkers.length)
    throw new Error("tried to seed more workers than is possible");

  return shuffle(allWorkers).slice(0, count);
}

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
