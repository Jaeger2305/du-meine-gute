import { Card } from "../types";
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
  butter,
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
  points: 0,
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
  points: 0,
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
  points: 0,
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
  points: 0,
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
  points: 2,
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
  points: 2,
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
  points: 1,
};

export const bakeryWithChain: Card = {
  name: "bakery-3",
  type: "test",
  resource: wheat,
  productionConfig: {
    output: [bread],
    input: [wood, wheat],
    chainInput: [wheat],
  },
  cost: 3,
  points: 2,
};

export const breadCard: Card = {
  type: "test",
  name: "test-bread",
  resource: wheat,
  productionConfig: {
    output: [bread],
    input: [coal, cattle],
  },
  cost: 2,
  points: 1,
};

export const bakeryWithSecondaryChain: Card = {
  name: "bakery-4",
  type: "test",
  resource: wheat,
  productionConfig: {
    output: [bread],
    input: [wood, wheat],
    chainInput: [butter, coal],
  },
  cost: 3,
  points: 2,
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
  points: 3,
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
  points: 3,
  isSunny: true,
};

export const office: Card = {
  name: "office-1",
  type: "test",
  resource: wood,
  cost: 4,
  isSunny: true,
  points: 2,
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
  points: 2,
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
  points: 2,
  isSunny: true,
};
