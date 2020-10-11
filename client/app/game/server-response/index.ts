import {
  GameState,
  ServerActionEnum,
  PlayerState,
} from "../types";
import {endStep} from "./end-step"
import {drawCard} from "./draw-card"
import { ServerActionResponse } from "../server-action/types"

type ServerResponseHandler = (
  gameState: GameState,
  playerState: PlayerState,
  payload: ServerActionResponse["response"]
) => void;

// These actions should not modify the severState, as that is controlled entirely in the server actions - either locally or via the go server
// But, they should update the game state, based on the response from the server
export const serverResponse: Record<ServerActionEnum, ServerResponseHandler> = {
  [ServerActionEnum.endStep]: endStep,
  [ServerActionEnum.drawCard]: drawCard,
  [ServerActionEnum.reserveFactory]: () => {}, // the optimistic response is fine
  [ServerActionEnum.assignWorkers]: () => {}, // the optimistic response is fine
  [ServerActionEnum.revealMarket]: () => {},
  [ServerActionEnum.startRound]: () => {},
};
