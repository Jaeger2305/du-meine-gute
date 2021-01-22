import { Resource } from "./resources";
import { Employee, ProductionEfficiency, AssignedEmployee } from "./worker";
import { PlayerActionEnum } from "./client";
import { LogLevel, ServerActionEnum } from "./server-action/types";

export { RoundSteps } from "./server-action";
export { EmployeeType } from "./worker";
export { ServerActionRequest } from "./server-action/types";
export {
  ServerActionEnum,
  PlayerActionEnum,
  Employee,
  ProductionEfficiency,
  AssignedEmployee,
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
  activeStep: number;
};

// A good place to add flexible features like hand count or play card limit in the future.
export type GameConfig = {
  marketSuns: number; // standard rules should be 3. Cards are drawn into the market until the number of suns matches this value.
  buildCountForEndGame: number; // standard rules should be 8. Once 8 cards are built, the end game round is triggered
  drawCount: number; // standard rules should be 2. Affects how many cards are able to be drawn at the beginning of the round.
  pointsPerResource: number; // standard rules should be 0.25. This means with total resource value of 37, a floored 7 points will be awarded.
  workerCount: number; // the number of workers to include - 4/6/8 depending on number of players.
  isTutorialEnabled: boolean; // give extra hints to the user as to what to do.
};

export type PlayerState = {
  id: string;
  playerNumber: number;
  player: Player;
  cardsInHand: Array<Card>;
  cardsInPlay: Array<Card>;
  availableActions: Array<PlayerActionEnum>;
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

export enum EventSource {
  Server = "server",
  Opponent = "opponent",
  Self = "self",
}

/** The events that can be tracked in the history
 * Perhaps this links to the server action enum eventually, but for now it's standalone.
 */
export enum EventType {
  StartRound = "START_ROUND",
  Draw = "DRAW",
  Discard = "DISCARD",
  MarketOpened = "MARKET_OPENED",
  MarketClosed = "MARKET_CLOSED",
  FactoryOpened = "FACTORY_OPENED",
  Production = "PRODUCTION",
  PointsUpdate = "POINTS_UPDATE",
  HiredEmployee = "HIRED_EMPLOYEE",
}

/** Map a servers events to events the player should see.
 * This is a bit more dev friendly, and definitely an area that could be tidied up for users.
 */
export const ServerActionEventTypeLookup: {
  [key in ServerActionEnum]?: EventType;
} = {
  [ServerActionEnum.startRound]: EventType.StartRound,
  [ServerActionEnum.drawCard]: EventType.Draw,
  [ServerActionEnum.discard]: EventType.Discard,
  [ServerActionEnum.endRound]: EventType.PointsUpdate,
  [ServerActionEnum.hireEmployee]: EventType.HiredEmployee,
  [ServerActionEnum.buildFactory]: EventType.FactoryOpened,
  [ServerActionEnum.produceAtFactory]: EventType.Production,
  [ServerActionEnum.revealMarket]: EventType.MarketOpened,
};

export type EventMessage = {
  eventType: EventType;
  eventSource: EventSource;
  message: string;
  logLevel: LogLevel;
  eventDetails?: any;
};
