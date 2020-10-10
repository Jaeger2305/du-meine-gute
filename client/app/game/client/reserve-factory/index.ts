import { Card, GameState, PlayerActionEnum, PlayerState } from "../../types";
import { removeActionFromAvailableActions } from "../../utils";

export function reserveFactory(gameState: GameState, playerState: PlayerState, factory: Card) {
  const cardIndex = playerState.cardsInHand.findIndex(
    (cardInHand) => cardInHand.name === factory.name
  );
  playerState.cardsInHand.splice(cardIndex, 1);

  playerState.reservedFactory = factory;

  removeActionFromAvailableActions(
    playerState,
    PlayerActionEnum.reserveFactory
  );
  return factory
}
