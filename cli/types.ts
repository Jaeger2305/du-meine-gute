export enum PlayerActionEnum {
  endStep = "endStep",
  drawCard = "drawCard",
  discardCard = "discardCard",
  assignEmployee = "assignEmployee",
  produceAtFactory = "produceAtFactory",
  buildFactory = "buildFactory",
  hireWorker = "hireWorker",
}

export type PlayerAction = {
  type: PlayerActionEnum;
  handler: (...rest: any) => any;
};

export type Card = {
  type: string;
  name: string;
  resource: Resource;
  output: Array<Resource>;
  input: Array<Resource>;
  cost: number;
  chainInput?: Array<Resource>;
};

export type Player = {
  name: string;
};

export type ProductionEfficiency = {
  productionCount: number;
  resourceSparingCount: number;
};

export type Employee = {
  name: string;
  modes: Array<ProductionEfficiency>;
  resourceSpecialty?: Resource; // workers can be hired only if meeting the requirement of a certain number of builds. E.g. an apprentice might need 2 wheat based factories to be hired.
  cost: number;
};

export type AssignedEmployee = {
  name: string;
  mode: ProductionEfficiency;
  assignment: Card;
};

export type GameState = {
  cardsInHand: Array<Card>;
  cardsInDeck: Array<Card>;
  cardsInDiscard: Array<Card>;
  cardsInPlay: Array<Card>;
  winner: Player | null;
  players: Array<Player>;
  availableActions: Array<PlayerAction>;
  availableEmployees: Array<Employee>;
  employees: Array<Employee>;
  assignedEmployees: Array<AssignedEmployee>;
  resources: Array<Resource>;
  reservedCards: Array<Card>; // cards which have been removed from the normal draw/discard loop. This is limited to cards which are used to represent resources.
  marketResources: Array<Resource>;
  score: number;
};

export enum ResourceType {
  wood = "wood",
  brick = "brick",
  wheat = "wheat",
  stone = "stone",
  cattle = "cattle",

  coal = "coal",
  butter = "butter",
  bread = "bread",
  leather = "leather",
}

// We can couple the card to the resource, or we can keep track of the cards reserved as goods separately. that's probably better too.
export type Resource = {
  type: ResourceType;
  value: number;
  baseResource: boolean;
};

enum Steps {
  startRound = "start",
  revealMarket = "reveal market",
  assignEmployees = "assign",
  produce = "produce",
  purchase = "purchase",
  endRound = "round end",
}

export const RoundSteps = [
  Steps.startRound,
  Steps.revealMarket,
  Steps.assignEmployees,
  Steps.revealMarket,
  Steps.produce,
  Steps.purchase,
  Steps.endRound,
];
