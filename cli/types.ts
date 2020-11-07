import { Resource } from "./resources";

export enum PlayerActionEnum {
  endStep = "endStep",
  drawCard = "drawCard",
  discardCard = "discardCard",
  assignEmployee = "assignEmployee",
  reserveFactory = "reserveFactory",
  unassignEmployee = "unassignEmployee",
  produceAtFactory = "produceAtFactory",
  buildFactory = "buildFactory",
  hireWorker = "hireWorker",
}

export type PlayerAction = {
  type: PlayerActionEnum;
  handler: (...rest: any) => any;
};

export type Card = {
  type: BuildingType;
  name: string;
  resource: Resource;
  productionConfig?: ProductionConfig;
  cost: number;
  points: number;
  isSunny?: boolean;
  boostDrawCount?: number;
  marketBoost?: Array<Resource>;
};

export type ProductionConfig = {
  output: Array<Resource>;
  input: Array<Resource>;
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
  resourceSpecialty?: Array<Resource>; // workers can be hired only if meeting the requirement of a certain number of builds. E.g. an apprentice might need 2 wheat based factories to be hired.
  cost: number;
  points: number;
  unassignmentCost: number;
};

export type AssignedEmployee = {
  name: string;
  mode: ProductionEfficiency;
  assignment: Card;
  unassignmentCost: number;
  hasProduced?: boolean;
};

export type GameState = {
  config: GameConfig;
  cardsInDeck: Array<Card>;
  cardsInDiscard: Array<Card>;
  winner: Player | null;
  players: Array<PlayerState>;
  availableEmployees: Array<Employee>;
  reservedCards: Array<Card>; // cards which have been removed from the normal draw/discard loop. This is limited to cards which are used to represent resources.
  marketCards: Array<Card>;
  score: number;
  isGameEnding?: boolean;
};

// A good place to add flexible features like hand count or play card limit in the future.
export type GameConfig = {
  marketSuns: number; // standard rules should be 3. Cards are drawn into the market until the number of suns matches this value.
  buildCountForEndGame: number; // standard rules should be 8. Once 8 cards are built, the end game round is triggered
  drawCount: number; // standard rules should be 2. Affects how many cards are able to be drawn at the beginning of the round.
  pointsPerResource: number; // standard rules should be 0.25. This means with total resource value of 37, a floored 7 points will be awarded.
  workerCount: number; // the number of workers to include - 4/6/8 depending on number of players.
};

export type PlayerState = {
  id: string;
  playerNumber: number;
  player: Player;
  cardsInHand: Array<Card>;
  cardsInPlay: Array<Card>;
  availableActions: Array<PlayerAction>;
  employees: Array<Employee>;
  assignedEmployees: Array<AssignedEmployee>;
  resources: Array<Resource>;
  reservedFactory: Card | null;
  score: number;
};

export enum BuildingType {
  bakery,
  brickMaker,
  butcher,
  cattleRanch,
  charburner,
  cooperage,
  foodFactory,
  glassmaker,
  ironSmelter,
  marketOffice,
  mill,
  sawmill,
  shoeMaker,
  tailor,
  tannery,
  toolMaker,
  unknown,
  weavingMill,
  windowMaker,
}

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
