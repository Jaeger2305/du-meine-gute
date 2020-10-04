import { BuildingType, Card } from "../types";
import {
  wood,
  wool,
  clay,
  bread,
  wheat,
  metal,
  cattle,
  leather,
  coal,
  plank,
  placeholder,
  glass,
} from "../resources";

// Factories

export const coalMineWheat: Card = {
  name: "coal-mine-wheat",
  type: BuildingType.charburner,
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
  type: BuildingType.charburner,
  resource: wood,
  productionConfig: {
    output: [coal],
    input: [wood, wool, wool],
    chainInput: [wood],
  },
  cost: 0,
  points: 0,
};

export const coalMineClay: Card = {
  name: "coal-mine-clay",
  type: BuildingType.charburner,
  resource: wood,
  productionConfig: {
    output: [coal],
    input: [wood, clay, clay],
    chainInput: [wood],
  },
  cost: 0,
  points: 0,
};

export const coalMineMetal: Card = {
  name: "coal-mine-metal",
  type: BuildingType.charburner,
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
  type: BuildingType.sawmill,
  resource: wood,
  productionConfig: {
    output: [plank],
    input: [wood, clay],
  },
  cost: 3,
  points: 2,
};

export const bakery: Card = {
  name: "bakery-1",
  type: BuildingType.bakery,
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
  type: BuildingType.bakery,
  resource: wheat,
  productionConfig: {
    output: [bread],
    input: [clay, wheat],
  },
  cost: 2,
  isSunny: true,
  points: 1,
};

export const bakeryWithChain: Card = {
  name: "bakery-3",
  type: BuildingType.bakery,
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
  type: BuildingType.bakery,
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
  type: BuildingType.bakery,
  resource: wheat,
  productionConfig: {
    output: [bread],
    input: [wood, wheat],
    chainInput: [metal, coal],
  },
  cost: 3,
  points: 2,
};

export const tannery: Card = {
  name: "tannery-1",
  type: BuildingType.tannery,
  resource: clay,
  productionConfig: {
    output: [leather],
    input: [cattle, clay],
    chainInput: [wood],
  },
  cost: 4,
  points: 3,
  isSunny: true,
};

export const altTannery: Card = {
  name: "tannery-1",
  type: BuildingType.tannery,
  resource: wood,
  productionConfig: {
    output: [leather],
    input: [cattle, clay],
    chainInput: [clay],
  },
  cost: 4,
  points: 3,
  isSunny: true,
};

export const office: Card = {
  name: "office-1",
  type: BuildingType.marketOffice,
  resource: wood,
  cost: 4,
  isSunny: true,
  points: 2,
  boostDrawCount: 1,
};

export const tradingPost: Card = {
  name: "trading-post-1",
  type: BuildingType.marketOffice,
  resource: wood,
  productionConfig: {
    output: [glass],
    input: [cattle, clay],
    chainInput: [clay],
  },
  cost: 4,
  points: 2,
  isSunny: true,
  marketBoost: [wood],
};

export const glassblower: Card = {
  name: "glassblower-1",
  type: BuildingType.glassmaker,
  resource: metal,
  productionConfig: {
    output: [glass],
    input: [placeholder, placeholder, placeholder],
  },
  cost: 2,
  points: 2,
  isSunny: true,
};
