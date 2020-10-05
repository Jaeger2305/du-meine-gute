import { drawCard as serverDrawCard } from "../../local-server/actions/draw-card";
import {
  Card,
  GameState,
  PlayerActionEnum,
  PlayerState,
} from "../../../../cli/types";
import { unknown } from "../../../../cli/game/cards";
import { removeActionFromAvailableActions } from "../../../../cli/game/utils";

function createUnknownCard(baseCard: Card = unknown): Card {
  return { ...unknown, ...baseCard };
}

export function drawCard(gameState: GameState, playerState: PlayerState) {
  const unknownCard = createUnknownCard();

  playerState.cardsInHand.push(unknownCard);
  // Find the event and delete it
  removeActionFromAvailableActions(playerState, PlayerActionEnum.drawCard);
  setTimeout(() => serverDrawCard(gameState, playerState, unknownCard), 3000);
}
