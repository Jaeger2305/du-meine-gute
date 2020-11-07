import { DiscardResponse } from "../types";
import {
  drawFromDeck,
  obfuscateDeck,
  discardCards,
  removeActionFromAvailableActions,
} from "../../utils";
import { GameState, ServerActionEnum, PlayerState, Card } from "../../types";
import { PlayerActionEnum } from "../../client";

export function discard(
  serverState: GameState,
  playerNumber: PlayerState["playerNumber"],
  cardsToDiscard: Array<Card>
): DiscardResponse {
  const playerState = serverState.players[playerNumber];
  discardCards(cardsToDiscard, playerState.cardsInHand);

  const drawnCards = cardsToDiscard
    .map(() =>
      drawFromDeck(serverState.cardsInDeck, serverState.cardsInDiscard)
    )
    .filter(Boolean);

  playerState.cardsInHand.push(...drawnCards);

  // Find the event and delete it
  removeActionFromAvailableActions(playerState, PlayerActionEnum.discard);

  // Send the response back
  return {
    type: ServerActionEnum.discard,
    isOK: true,
    response: {
      drawnCards,
      cardsInDiscard: serverState.cardsInDiscard,
      cardsInDeck: obfuscateDeck(serverState.cardsInDeck),
    },
  };
}
