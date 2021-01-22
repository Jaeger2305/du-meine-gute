import {
  AssignedEmployee,
  Card,
  GameState,
  Player,
  PlayerState,
} from "../types";

export enum ServerActionEnum {
  endStep = "endStep",
  discard = "discard",
  drawCard = "drawCard",
  drawStep = "drawStep",
  produceStep = "produceStep",
  purchaseStep = "purchaseStep",
  assignWorkers = "assignWorkers",
  produceAtFactory = "produceAtFactory",
  reserveFactory = "reserveFactory",
  unreserveFactory = "unreserveFactory",
  buildFactory = "buildFactory",
  revealMarket = "revealMarket",
  startRound = "startRound",
  assignEmployee = "assignEmployee",
  unassignEmployee = "unassignEmployee",
  hireEmployee = "hireEmployee",
  endRound = "endRound",
}

export enum LogLevel {
  Debug,
  Info,
  Visible,
  Toast,
}
export interface ServerActionRequest {
  type: ServerActionEnum;
  logLevel: LogLevel;
  playerActionResponse?: any;
}

export interface ServerActionResponse {
  type: ServerActionEnum;
  isOK: boolean;
  logLevel: LogLevel;
  response: any;
}

export type ServerActionHandler = (
  serverState: GameState,
  playerNumber: PlayerState["playerNumber"],
  playerActionResponse?: any
) => any;

export interface StartRoundResponse extends ServerActionResponse {
  type: ServerActionEnum.startRound;
  response: {
    availableActions: PlayerState["availableActions"];
  };
}

export interface DrawCardResponse extends ServerActionResponse {
  type: ServerActionEnum.drawCard;
  response: {
    drawnCard: Card;
    cardsInDiscard: Array<Card>;
    cardsInDeck: Array<Card>;
  };
}

export interface DiscardResponse extends ServerActionResponse {
  type: ServerActionEnum.discard;
  response: {
    drawnCards: Array<Card>;
    cardsInDiscard: Array<Card>;
    cardsInDeck: Array<Card>;
  };
}

export interface RevealMarketResponse extends ServerActionResponse {
  type: ServerActionEnum.revealMarket;
  response: {
    drawnCards: Array<Card>;
    cardsInDiscard: Array<Card>;
    cardsInDeck: Array<Card>;
    availableActions: PlayerState["availableActions"];
  };
}

export interface FactoryBuildResponse extends ServerActionResponse {
  type: ServerActionEnum.buildFactory;
  response: {};
}

export interface HireEmployeeResponse extends ServerActionResponse {
  type: ServerActionEnum.hireEmployee;
  response: {};
}

export interface ProduceAtFactoryResponse extends ServerActionResponse {
  type: ServerActionEnum.produceAtFactory;
  response: {};
}

export interface EndStepResponse extends ServerActionResponse {
  type: ServerActionEnum.endStep;
  response: {
    activeStep: GameState["activeStep"];
    availableActions: PlayerState["availableActions"];
  };
}

export interface EndRoundResponse extends ServerActionResponse {
  type: ServerActionEnum.endRound;
  response: {
    assignedEmployees: Array<AssignedEmployee>;
    winner?: Player;
    isGameEnding: boolean;
    discardedCards: Array<Card>;
    availableActions: PlayerState["availableActions"];
    score: PlayerState["score"];
  };
}
