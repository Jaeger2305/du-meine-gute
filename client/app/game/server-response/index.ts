import {
  BuildingType,
  Card,
  GameState,
  PlayerActionEnum,
  PlayerState,
} from "../types";

const endStep = () => {};

const drawCard = (
  gameState: GameState,
  serverState: GameState,
  playerState: PlayerState,
  drawnCard: Card,
  cardsInDiscard: GameState["cardsInDiscard"],
  cardsInDeck: GameState["cardsInDeck"]
) => {
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
  Object.assign(unknownCard, drawnCard);
};

// These actions should not modify the severState, as that is controlled entirely in the server actions - either locally or via the go server
// But, they should update the game state, based on the response from the server
export const serverResponse = {
  endStep: {
    type: PlayerActionEnum.endStep,
    handler: endStep,
  },
  drawCard: {
    type: PlayerActionEnum.drawCard,
    handler: drawCard,
  },
};
