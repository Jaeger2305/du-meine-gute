import * as prompts from "prompts";
import { Card, GameState, PlayerActionEnum, PlayerState } from "../../types";
import { drawFromDeck, removeActionFromAvailableActions } from "../utils";

export async function discard(gameState: GameState, playerState: PlayerState) {
  const cardChoice: {
    cards: Array<{ card: Card; index: number }>;
  } = await prompts({
    type: "multiselect",
    message: `pick cards to discard, and gain that resource`,
    name: "cards",
    choices: playerState.cardsInHand.map((card, index) => ({
      title: card.name,
      value: { card, index },
    })),
  });
  for (const card of cardChoice.cards) {
    playerState.cardsInHand.splice(card.index, 1);
    gameState.cardsInDiscard.push(card.card);
    const drawnCard = drawFromDeck(
      gameState.cardsInDeck,
      gameState.cardsInDiscard
    );
    playerState.cardsInHand.push(drawnCard);
  }
  removeActionFromAvailableActions(playerState, PlayerActionEnum.discardCard);
}
