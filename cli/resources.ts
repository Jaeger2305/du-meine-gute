import { Resource, ResourceType } from "./types";

export const wheat: Resource = {
  type: ResourceType.wheat,
  value: 0,
  baseResource: true,
};

export const wood: Resource = {
  type: ResourceType.wood,
  value: 0,
  baseResource: true,
};

export const brick: Resource = {
  type: ResourceType.brick,
  value: 0,
  baseResource: true,
};

export const stone: Resource = {
  type: ResourceType.stone,
  value: 0,
  baseResource: true,
};

export const cattle: Resource = {
  type: ResourceType.cattle,
  value: 0,
  baseResource: true,
};

export const coal: Resource = {
  type: ResourceType.coal,
  value: 1,
  baseResource: false,
};

export const bread: Resource = {
  type: ResourceType.coal,
  value: 1,
  baseResource: false,
};

export const leather: Resource = {
  type: ResourceType.leather,
  value: 1,
  baseResource: false,
};
