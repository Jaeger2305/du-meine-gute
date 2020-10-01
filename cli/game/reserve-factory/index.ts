import * as prompts from "prompts";
import { GameState, PlayerActionEnum, Card, PlayerState } from "../../types";
import { removeActionFromAvailableActions } from "../utils";
import { reserveFactory as serverReserveFactory } from "../../local-server";

export async function reserveFactory(
  gameState: GameState,
  playerState: PlayerState
) {
  // If no cards in hand, remove action
  if (!playerState.cardsInHand.length)
    return removeActionFromAvailableActions(
      playerState,
      PlayerActionEnum.reserveFactory
    );

  // Pick a card to reserve
  const cardChoice = await prompts({
    type: "select",
    message: `pick an card to reserve`,
    name: "card",
    choices: playerState.cardsInHand.map((card) => ({
      title: card.name,
      value: card,
    })),
  });

  // Reserve card for building
  const {
    response: { reservedFactory, cardsInHand, availableActions },
  } = serverReserveFactory(gameState, playerState, cardChoice.card);

  // Update state with results
  // We should probably optimistically update, and if the response doesn't match, throw an error and restore from state.
  playerState.reservedFactory = reservedFactory;
  playerState.cardsInHand = cardsInHand;
  playerState.availableActions = availableActions;
  return;
}
