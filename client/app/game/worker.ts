import { Card } from "./types";
import { Resource } from "./resources";
import { wood, wool, clay, wheat, metal } from "./resources";
import { shuffle } from "lodash";

export type ProductionEfficiency = {
  productionCount: number;
  resourceSparingCount: number;
};

export type AssignedEmployee = {
  name: string;
  type: EmployeeType;
  mode: ProductionEfficiency;
  assignment: Card;
  unassignmentCost: number;
  hasProduced: boolean;
};

export enum EmployeeType {
  Actor = "ACTOR",
  Banker = "BANKER",
  Boss = "BOSS",
  BrickLayer = "BRICK_LAYER",
  Builder = "BUILDER",
  Investor = "INVESTOR",
  Farmhand = "FARMHAND",
  Forester = "FORESTER",
  MillOwner = "MILL_OWNER",
  OfficeApprentice = "OFFICE_APPRENTICE",
  OfficeManager = "OFFICE_MANAGER",
  Overseer = "OVERSEER",
  SawmillManager = "SAWMILL_MANAGER",
  ShopOwner = "SHOP_OWNER",
  Supervisor = "SUPERVISOR",
  Tailor = "TAILOR",
  Weaver = "WEAVER",
}

export type Employee = {
  name: string;
  type: EmployeeType;
  modes: Array<ProductionEfficiency>;
  resourceSpecialty?: Array<Resource>; // workers can be hired only if meeting the requirement of a certain number of builds. E.g. an apprentice might need 2 wheat based factories to be hired.
  cost: number;
  points: number;
  unassignmentCost: number;
};

// Employees

const actor: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "actor",
  type: EmployeeType.Actor,
  resourceSpecialty: [wood, wool, wool],
  cost: 6,
  points: 3,
  unassignmentCost: 2,
};

const banker: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "banker",
  type: EmployeeType.Banker,
  resourceSpecialty: [clay, wood, metal, metal],
  cost: 6,
  points: 3,
  unassignmentCost: 2,
};

const brickLayer: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "brick-layer",
  type: EmployeeType.BrickLayer,
  resourceSpecialty: [clay, clay],
  cost: 4,
  points: 2,
  unassignmentCost: 2,
};

const builder: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "builder",
  type: EmployeeType.Builder,
  resourceSpecialty: [clay, clay, clay, clay],
  cost: 2,
  points: 3,
  unassignmentCost: 2,
};

const farmhand: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "farmhand",
  type: EmployeeType.Farmhand,
  resourceSpecialty: [wheat, wheat, wheat, wheat],
  cost: 3,
  points: 2,
  unassignmentCost: 2,
};

const forester: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "forester",
  type: EmployeeType.Forester,
  resourceSpecialty: [wood, wood, wood, wood],
  cost: 2,
  points: 3,
  unassignmentCost: 2,
};

const millOwner: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "mill-owner",
  type: EmployeeType.MillOwner,
  resourceSpecialty: [wheat, wheat, metal],
  cost: 6,
  points: 3,
  unassignmentCost: 2,
};

const officeApprentice: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "office-apprentice",
  type: EmployeeType.OfficeApprentice,
  resourceSpecialty: [metal, metal, metal],
  cost: 3,
  points: 2,
  unassignmentCost: 2,
};

const officeManager: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "office-manager",
  type: EmployeeType.OfficeManager,
  resourceSpecialty: [metal, metal],
  cost: 4,
  points: 2,
  unassignmentCost: 2,
};

const overseer: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "overseer",
  type: EmployeeType.Overseer,
  resourceSpecialty: [wool, metal, clay, wood, wheat],
  cost: 2,
  points: 3,
  unassignmentCost: 2,
};

const sawmillManager: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "sawmill-manager",
  type: EmployeeType.SawmillManager,
  resourceSpecialty: [wood, wood],
  cost: 4,
  points: 2,
  unassignmentCost: 2,
};

const shopOwner: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "shop-owner",
  type: EmployeeType.ShopOwner,
  resourceSpecialty: [wood, wool, metal, metal],
  cost: 2,
  points: 3,
  unassignmentCost: 2,
};

const supervisor: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "supervisor",
  type: EmployeeType.Supervisor,
  resourceSpecialty: [wool, clay, wood, wheat],
  cost: 4,
  points: 3,
  unassignmentCost: 2,
};

const tailor: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "tailor",
  type: EmployeeType.Tailor,
  resourceSpecialty: [wool, wool],
  cost: 4,
  points: 2,
  unassignmentCost: 2,
};

const weaver: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "weaver",
  type: EmployeeType.Weaver,
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
  type: EmployeeType.Boss,
  cost: 0,
  points: 0,
  unassignmentCost: 0,
};

export const investor: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "investor",
  type: EmployeeType.Investor,
  cost: 0,
  points: 0,
  unassignmentCost: 0,
};

export const employeeRecords: Record<EmployeeType, Employee> = {
  [EmployeeType.Boss]: boss,
  [EmployeeType.Investor]: investor,

  [EmployeeType.Actor]: actor,
  [EmployeeType.Banker]: banker,
  [EmployeeType.BrickLayer]: brickLayer,
  [EmployeeType.Builder]: builder,
  [EmployeeType.Farmhand]: farmhand,
  [EmployeeType.Forester]: forester,
  [EmployeeType.MillOwner]: millOwner,
  [EmployeeType.OfficeApprentice]: officeApprentice,
  [EmployeeType.OfficeManager]: officeManager,
  [EmployeeType.Overseer]: overseer,
  [EmployeeType.SawmillManager]: sawmillManager,
  [EmployeeType.ShopOwner]: shopOwner,
  [EmployeeType.Supervisor]: supervisor,
  [EmployeeType.Tailor]: tailor,
  [EmployeeType.Weaver]: weaver,
};
