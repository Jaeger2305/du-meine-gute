import { Card, Employee } from "../types";
import {
  wood,
  wool,
  brick,
  bread,
  wheat,
  stone,
  metal,
  cattle,
  leather,
  coal,
  plank,
  documents,
  placeholder,
  glass,
} from "../resources";

// Factories

export const coalMineWheat: Card = {
  name: "coal-mine-wheat",
  type: "test",
  resource: wood,
  productionConfig: {
    output: [coal],
    input: [wood, wheat, wheat],
    chainInput: [wood],
  },
  cost: 0,
};

export const coalMineWool: Card = {
  name: "coal-mine-wool",
  type: "test",
  resource: wood,
  productionConfig: {
    output: [coal],
    input: [wood, wool, wool],
    chainInput: [wood],
  },
  cost: 0,
};

export const coalMineBrick: Card = {
  name: "coal-mine-brick",
  type: "test",
  resource: wood,
  productionConfig: {
    output: [coal],
    input: [wood, brick, brick],
    chainInput: [wood],
  },
  cost: 0,
};

export const coalMineMetal: Card = {
  name: "coal-mine-metal",
  type: "test",
  resource: wood,
  productionConfig: {
    output: [coal],
    input: [wood, metal, metal],
    chainInput: [wood],
  },
  cost: 0,
};

export const sawmill: Card = {
  name: "sawmill-1",
  type: "test",
  resource: wood,
  productionConfig: {
    output: [plank],
    input: [wood, stone],
  },
  cost: 3,
};

export const bakery: Card = {
  name: "bakery-1",
  type: "test",
  resource: wheat,
  productionConfig: {
    output: [bread],
    input: [wood, wheat],
  },
  cost: 2,
};

export const altBakery: Card = {
  name: "bakery-2",
  type: "test",
  resource: wheat,
  productionConfig: {
    output: [bread],
    input: [stone, wheat],
  },
  cost: 2,
  isSunny: true,
};

export const bakeryWithChain: Card = {
  name: "bakery-2",
  type: "test",
  resource: wheat,
  productionConfig: {
    output: [bread],
    input: [wood, wheat],
    chainInput: [wheat],
  },
  cost: 3,
};

export const tannery: Card = {
  name: "tannery-1",
  type: "test",
  resource: brick,
  productionConfig: {
    output: [leather],
    input: [cattle, stone],
    chainInput: [wood],
  },
  cost: 4,
  isSunny: true,
};

export const altTannery: Card = {
  name: "tannery-1",
  type: "test",
  resource: wood,
  productionConfig: {
    output: [leather],
    input: [cattle, brick],
    chainInput: [brick],
  },
  cost: 4,
  isSunny: true,
};

export const office: Card = {
  name: "office-1",
  type: "test",
  resource: wood,
  cost: 4,
  isSunny: true,
  boostDrawCount: 1,
};

export const tradingPost: Card = {
  name: "trading-post-1",
  type: "test",
  resource: wood,
  productionConfig: {
    output: [documents],
    input: [cattle, brick],
    chainInput: [brick],
  },
  cost: 4,
  isSunny: true,
  marketBoost: [wood],
};

export const glassblower: Card = {
  name: "glassblower-1",
  type: "test",
  resource: stone,
  productionConfig: {
    output: [glass],
    input: [placeholder, placeholder, placeholder],
  },
  cost: 2,
  isSunny: true,
};

// Employees

export const apprentice: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "apprentice-1",
  resourceSpecialty: wood,
  cost: 3,
  unassignmentCost: 2,
};

export const skilledApprentice: Employee = {
  modes: [{ productionCount: 3, resourceSparingCount: 0 }],
  name: "skilled-apprentice-1",
  resourceSpecialty: wheat,
  cost: 4,
  unassignmentCost: 2,
};

export const master: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "master-1",
  resourceSpecialty: wheat,
  cost: 5,
  unassignmentCost: 2,
};

export const boss: Employee = {
  modes: [
    { productionCount: 1, resourceSparingCount: 1 },
    { productionCount: 2, resourceSparingCount: 0 },
  ],
  name: "boss-1",
  cost: 0,
  unassignmentCost: 0,
};
