import { ServerActionResponse } from "../types";
import { GameState, PlayerState, ServerActionEnum } from "../../types";
import { PlayerActionEnum } from "../../client";

export function unreserveFactory(
  serverState: GameState,
  playerNumber: PlayerState["playerNumber"]
): ServerActionResponse {
  console.warn("no error handling");
  const reservedFactory = serverState.players[playerNumber].reservedFactory;

  serverState.players[playerNumber].cardsInHand.push(reservedFactory);
  serverState.players[playerNumber].reservedFactory = null;

  serverState.players[playerNumber].availableActions.push(
    PlayerActionEnum.reserveFactory
  );
  return {
    type: ServerActionEnum.unreserveFactory,
    isOK: true,
    response: {
      availableActions: serverState.players[playerNumber].availableActions,
    },
  };
}
