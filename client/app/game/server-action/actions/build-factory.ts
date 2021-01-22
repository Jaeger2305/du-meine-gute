import { ServerActionResponse } from "../types";
import { GameState, PlayerState } from "../../types";
import { payForFactory } from '../../client/build-factory/build-factory-utils';
import { Resource } from '../../resources';

export function buildFactory(
  serverState: GameState,
  playerNumber: PlayerState["playerNumber"],
  {
    resources,
  }: {
    resources: Array<Resource>;
  }
  payForFactory(serverState, serverState.players[playerNumber], resources);
  serverState.players[playerNumber].reservedFactory = null;

  return {
    type: null,
    isOK: true,
    response: {},
  };
}
