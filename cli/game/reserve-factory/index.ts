import * as prompts from "prompts";
import { GameState, PlayerActionEnum, Card } from "../../types";
import { removeActionFromAvailableActions } from "../utils";
import { reserveFactory as serverReserveFactory } from "../../local-server";

export async function reserveFactory(gameState: GameState) {
  // If no cards in hand, remove action
  if (!gameState.cardsInHand.length)
    return removeActionFromAvailableActions(
      gameState,
      PlayerActionEnum.reserveFactory
    );

  // Pick a card to reserve
  const cardChoice = await prompts({
    type: "select",
    message: `pick an card to reserve`,
    name: "card",
    choices: gameState.cardsInHand.map((card) => ({
      title: card.name,
      value: card,
    })),
  });

  // Reserve card for building
  const {
    response: { reservedFactory, cardsInHand, availableActions },
  } = serverReserveFactory(gameState, cardChoice.card);

  // Update state with results
  // We should probably optimistically update, and if the response doesn't match, throw an error and restore from state.
  gameState.reservedFactory = reservedFactory;
  gameState.cardsInHand = cardsInHand;
  gameState.availableActions = availableActions;
  return;
}
