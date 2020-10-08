import { Card, ServerActionEnum } from "../types";

export type ServerResponse = {
  response: any;
};

export type DrawCardResponse = {
  type: ServerActionEnum.drawCard;
  isOK: boolean;
  response: {
    drawnCard: Card;
    cardsInDiscard: Array<Card>;
    cardsInDeck: Array<Card>;
  };
};
