import { DrawCardResponse } from "../server-action/types";
import {
  BuildingType,
  Card,
  GameState,
  ServerActionEnum,
  PlayerState,
} from "../types";

const endStep = () => {};

const drawCard = (
  gameState: GameState,
  serverState: GameState,
  playerState: PlayerState,
  { drawnCard, cardsInDiscard, cardsInDeck }: DrawCardResponse["response"]
): void => {
  if (gameState.cardsInDiscard.length !== cardsInDiscard.length) {
    gameState.cardsInDiscard.splice(
      0,
      gameState.cardsInDiscard.length,
      ...cardsInDiscard
    );
  }
  if (gameState.cardsInDeck.length !== cardsInDeck.length) {
    gameState.cardsInDeck.splice(
      0,
      gameState.cardsInDeck.length,
      ...cardsInDeck
    );
  }
  const unknownCard = playerState.cardsInHand.find(
    (card) => card.type === BuildingType.unknown
  );
  if (!unknownCard) {
    throw new Error(
      "An unknown card was expected here to populate - maybe it already completed."
    );
  }
  Object.assign(unknownCard, drawnCard);
};

type ServerResponseHandler = (
  gameState: GameState,
  serverState: GameState,
  playerState: PlayerState,
  payload: any
) => void;

// These actions should not modify the severState, as that is controlled entirely in the server actions - either locally or via the go server
// But, they should update the game state, based on the response from the server
export const serverResponse: Record<ServerActionEnum, ServerResponseHandler> = {
  [ServerActionEnum.endStep]: endStep,
  [ServerActionEnum.drawCard]: drawCard,
  [ServerActionEnum.revealMarket]: () => {},
  [ServerActionEnum.startRound]: () => {},
};
