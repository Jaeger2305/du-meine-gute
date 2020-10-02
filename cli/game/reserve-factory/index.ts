import * as prompts from "prompts";
import { GameState, PlayerActionEnum, Card, PlayerState } from "../../types";
import { removeActionFromAvailableActions } from "../utils";
import { reserveFactory as clientReserveFactory } from "./reserve-factory-utils";
import { reserveFactory as serverReserveFactory } from "../../local-server";

export async function reserveFactory(
  gameState: GameState,
  playerState: PlayerState
): Promise<void> {
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

  // Notify server of choice
  serverReserveFactory(gameState, playerState, cardChoice.card);

  // Optimistically update state with results
  clientReserveFactory(playerState, cardChoice.card);
}
