import * as prompts from "prompts";
import { Card, GameState, PlayerActionEnum } from "../../types";
import { removeActionFromAvailableActions } from "../utils";

export async function discard(gameState: GameState) {
  const cardChoice: {
    cards: Array<{ card: Card; index: number }>;
  } = await prompts({
    type: "multiselect",
    message: `pick cards to discard, and gain that resource`,
    name: "cards",
    choices: gameState.cardsInHand.map((card, index) => ({
      title: card.name,
      value: { card, index },
    })),
  });
  for (const card of cardChoice.cards) {
    gameState.cardsInHand.splice(card.index, 1);
    gameState.cardsInDiscard.push(card.card);
    if (!gameState.cardsInDeck.length) {
      gameState.cardsInDeck = gameState.cardsInDiscard.slice();
      gameState.cardsInDiscard = [];
    }
    gameState.cardsInHand.push(gameState.cardsInDeck.pop());
  }
  removeActionFromAvailableActions(gameState, PlayerActionEnum.discardCard);
}
