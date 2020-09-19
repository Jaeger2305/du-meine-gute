import { Card, Resource, Employee } from "../types";

export const coalMine: Card = {
  name: "coal-mine-1",
  type: "test",
  resource: Resource.wood,
  output: [Resource.coal],
  input: [Resource.wood, Resource.brick],
};

export const bakery: Card = {
  name: "bakery-1",
  type: "test",
  resource: Resource.wheat,
  output: [Resource.bread],
  input: [Resource.wood, Resource.wheat],
};

export const bakeryWithChain: Card = {
  name: "bakery-2",
  type: "test",
  resource: Resource.wheat,
  output: [Resource.bread],
  input: [Resource.wood, Resource.wheat],
  chainInput: [Resource.wheat],
};

export const tannery: Card = {
  name: "tannery-1",
  type: "test",
  resource: Resource.brick,
  output: [Resource.leather],
  input: [Resource.cattle, Resource.stone],
  chainInput: [Resource.wood],
};

export const apprentice: Employee = {
  modes: [{ productionCount: 1, resourceSparingCount: 0 }],
  name: "apprentice-1",
  resourceSpecialty: Resource.wood,
};

export const boss: Employee = {
  modes: [
    { productionCount: 1, resourceSparingCount: 1 },
    { productionCount: 2, resourceSparingCount: 0 },
  ],
  name: "boss-1",
};
