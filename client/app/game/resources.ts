// We can couple the card to the resource, or we can keep track of the cards reserved as goods separately. that's probably better too.
export type Resource = {
  type: ResourceType;
  value: number;
  baseResource: boolean;
};

export enum ResourceType {
  placeholder = "placeholder", // the resource can be any base value
  unknown = "unknown", // the resource isn't identified yet

  // base resources
  clay = "clay",
  metal = "metal",
  wheat = "wheat",
  wood = "wood",
  wool = "wool",

  // secondary resources
  barrel = "barrel",
  bread = "bread",
  brick = "brick",
  cattle = "cattle",
  cloth = "cloth",
  coal = "coal",
  feast = "feast",
  glass = "glass",
  grain = "grain",
  ingot = "ingot",
  leather = "leather",
  meat = "meat",
  plank = "plank",
  shirt = "shirt",
  shoe = "shoe",
  tools = "tools",
  window = "window",
}

export const defaultResourceOrder: Record<ResourceType, number> = {
  [ResourceType.wood]: 1,
  [ResourceType.clay]: 2,
  [ResourceType.wheat]: 3,
  [ResourceType.wool]: 4,
  [ResourceType.metal]: 5,
  [ResourceType.coal]: 6,
  [ResourceType.grain]: 7,
  [ResourceType.ingot]: 8,
  [ResourceType.brick]: 9,
  [ResourceType.plank]: 10,
  [ResourceType.glass]: 11,
  [ResourceType.bread]: 12,
  [ResourceType.cattle]: 13,
  [ResourceType.cloth]: 14,
  [ResourceType.tools]: 15,
  [ResourceType.barrel]: 16,
  [ResourceType.leather]: 17,
  [ResourceType.meat]: 18,
  [ResourceType.window]: 19,
  [ResourceType.shirt]: 20,
  [ResourceType.shoe]: 21,
  [ResourceType.feast]: 22,
  [ResourceType.unknown]: 23,
  [ResourceType.placeholder]: 24,
};

// Special

export const unknown: Resource = {
  type: ResourceType.unknown,
  value: 0,
  baseResource: true,
};

export const placeholder: Resource = {
  type: ResourceType.placeholder,
  value: 0,
  baseResource: true,
};

// Base

export const wheat: Resource = {
  type: ResourceType.wheat,
  value: 0,
  baseResource: true,
};

export const wool: Resource = {
  type: ResourceType.wool,
  value: 0,
  baseResource: true,
};

export const metal: Resource = {
  type: ResourceType.metal,
  value: 0,
  baseResource: true,
};

export const wood: Resource = {
  type: ResourceType.wood,
  value: 0,
  baseResource: true,
};

export const clay: Resource = {
  type: ResourceType.clay,
  value: 0,
  baseResource: true,
};

// Secondary

export const barrel: Resource = {
  type: ResourceType.barrel,
  value: 5,
  baseResource: false,
};

export const bread: Resource = {
  type: ResourceType.bread,
  value: 1,
  baseResource: false,
};

export const brick: Resource = {
  type: ResourceType.brick,
  value: 2,
  baseResource: false,
};

export const cattle: Resource = {
  type: ResourceType.cattle,
  value: 3,
  baseResource: false,
};

export const cloth: Resource = {
  type: ResourceType.cloth,
  value: 3,
  baseResource: false,
};

export const coal: Resource = {
  type: ResourceType.coal,
  value: 1,
  baseResource: false,
};

export const feast: Resource = {
  type: ResourceType.feast,
  value: 8,
  baseResource: false,
};

export const glass: Resource = {
  type: ResourceType.glass,
  value: 4,
  baseResource: false,
};

export const grain: Resource = {
  type: ResourceType.grain,
  value: 2,
  baseResource: false,
};

export const ingot: Resource = {
  type: ResourceType.ingot,
  value: 3,
  baseResource: false,
};

export const leather: Resource = {
  type: ResourceType.leather,
  value: 5,
  baseResource: false,
};

export const meat: Resource = {
  type: ResourceType.meat,
  value: 6,
  baseResource: false,
};

export const plank: Resource = {
  type: ResourceType.plank,
  value: 3,
  baseResource: false,
};

export const shirt: Resource = {
  type: ResourceType.shirt,
  value: 4,
  baseResource: false,
};

export const tools: Resource = {
  type: ResourceType.tools,
  value: 6,
  baseResource: false,
};

export const window: Resource = {
  type: ResourceType.window,
  value: 5,
  baseResource: false,
};

export const shoe: Resource = {
  type: ResourceType.shoe,
  value: 8,
  baseResource: false,
};

export const resourceRecords: Record<ResourceType, Resource> = {
  // special
  [ResourceType.unknown]: unknown,
  [ResourceType.placeholder]: placeholder,

  // base
  [ResourceType.clay]: clay,
  [ResourceType.metal]: metal,
  [ResourceType.wheat]: wheat,
  [ResourceType.wood]: wood,
  [ResourceType.wool]: wool,

  // secondary
  [ResourceType.barrel]: barrel,
  [ResourceType.bread]: bread,
  [ResourceType.brick]: brick,
  [ResourceType.cattle]: cattle,
  [ResourceType.cloth]: cloth,
  [ResourceType.coal]: coal,
  [ResourceType.feast]: feast,
  [ResourceType.glass]: glass,
  [ResourceType.grain]: grain,
  [ResourceType.ingot]: ingot,
  [ResourceType.leather]: leather,
  [ResourceType.meat]: meat,
  [ResourceType.plank]: plank,
  [ResourceType.shirt]: shirt,
  [ResourceType.shoe]: shoe,
  [ResourceType.tools]: tools,
  [ResourceType.window]: window,
};
