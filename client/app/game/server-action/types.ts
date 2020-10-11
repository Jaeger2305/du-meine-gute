import { Card, GameState, PlayerState } from "../types";

export enum ServerActionEnum {
  endStep = "endStep",
  drawCard = "drawCard",
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
) => void;

export interface DrawCardResponse extends ServerActionResponse {
  type: ServerActionEnum.drawCard;
  response: {
    drawnCard: Card;
    cardsInDiscard: Array<Card>;
    cardsInDeck: Array<Card>;
  };
}

export interface EndStepResponse extends ServerActionResponse {
  type: ServerActionEnum.endStep;
  response: {
    availableActions: PlayerState["availableActions"]
  }
}
