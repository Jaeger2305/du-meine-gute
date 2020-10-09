import { Card, ServerActionEnum } from "../types";

export interface ServerActionResponse {
  type: ServerActionEnum;
  isOK: boolean;
  response: any;
}

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
}
