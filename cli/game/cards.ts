import { Card, Employee } from "../types";
import {
  wood,
  brick,
  bread,
  wheat,
  stone,
  cattle,
  leather,
  coal,
} from "../resources";

export const coalMine: Card = {
  name: "coal-mine-1",
  type: "test",
  resource: wood,
  output: [coal],
  input: [wood, brick],
  cost: 0,
};

export const bakery: Card = {
  name: "bakery-1",
  type: "test",
  resource: wheat,
  output: [bread],
  input: [wood, wheat],
  cost: 2,
};

export const bakeryWithChain: Card = {
  name: "bakery-2",
  type: "test",
  resource: wheat,
  output: [bread],
  input: [wood, wheat],
  chainInput: [wheat],
  cost: 3,
};

export const tannery: Card = {
  name: "tannery-1",
  type: "test",
  resource: brick,
  output: [leather],
  input: [cattle, stone],
  chainInput: [wood],
  cost: 4,
};

export const apprentice: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "apprentice-1",
  resourceSpecialty: wood,
  cost: 5,
};

export const boss: Employee = {
  modes: [
    { productionCount: 1, resourceSparingCount: 1 },
    { productionCount: 2, resourceSparingCount: 0 },
  ],
  name: "boss-1",
  cost: 0,
};