import { drawCard as serverDrawCard } from "../../local-server/actions/draw-card";
import { GameState, PlayerState } from "../../types";

export function drawCard(gameState: GameState, playerState: PlayerState) {
  const {
    response: { cardsInDeck, cardsInHand, cardsInDiscard },
  } = serverDrawCard(gameState, playerState);
  playerState.cardsInHand = cardsInHand;
  gameState.cardsInDeck = cardsInDeck;
  gameState.cardsInDiscard = cardsInDiscard;
}
