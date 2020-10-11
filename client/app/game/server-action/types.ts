import { Card, GameState, PlayerState } from "../types";

export enum ServerActionEnum {
  endStep = "endStep",
  drawCard = "drawCard",
  drawStep = "drawStep",
  assignWorkers = "assignWorkers",
  reserveFactory = "reserveFactory",
  revealMarket = "revealMarket",
  startRound = "startRound",
}

export interface ServerActionRequest {
  type: ServerActionEnum;
  playerActionResponse?: any;
}

export interface ServerActionResponse {
  type: ServerActionEnum;
  isOK: boolean;
  response: any;
}

export type ServerActionHandler = (
  serverState: GameState,
  playerNumber: PlayerState["playerNumber"],
  playerActionResponse?: any
) => any;

export interface DrawCardResponse extends ServerActionResponse {
  type: ServerActionEnum.drawCard;
  response: {
    drawnCard: Card;
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
    availableActions: PlayerState["availableActions"]
  };
}

export interface EndStepResponse extends ServerActionResponse {
  type: ServerActionEnum.endStep;
  response: {
    activeStep: GameState["activeStep"]
    availableActions: PlayerState["availableActions"]
  }
}
