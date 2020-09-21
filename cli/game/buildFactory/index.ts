import * as prompts from "prompts";
import { GameState } from "../../types";
import { playCard as serverPlayCard } from "../../local-server";

export async function buildFactory(gameState: GameState) {
  const cardChoice = await prompts({
    type: "select",
    message: `pick an card to play`,
    name: "card",
    choices: gameState.cardsInHand.map((card) => ({
      title: card.name,
      value: card,
    })),
  });
  const {
    response: { cardsInPlay, cardsInHand },
  } = serverPlayCard(gameState, cardChoice.card);
  gameState.cardsInPlay = cardsInPlay;
  gameState.cardsInHand = cardsInHand;
}
