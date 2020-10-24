import { GameState, ServerActionEnum, PlayerState } from "../types";
import { endStep } from "./end-step";
import { discard } from "./discard";
import { drawCard } from "./draw-card";
import { ServerActionResponse } from "../server-action/types";
import { revealMarket } from "./reveal-market";
import { assignmentStep } from "./assignment-step";
import { produceStep } from "./produce-step";
import { purchaseStep } from "./purchase-step";
import { startRound } from "./start-round";
import { endRound } from "./end-round";
import { drawStep } from "./draw-step";

type ServerResponseHandler = (
  gameState: GameState,
  playerState: PlayerState,
  payload: ServerActionResponse["response"]
) => void;

// These actions should not modify the severState, as that is controlled entirely in the server actions - either locally or via the go server
// But, they should update the game state, based on the response from the server
export const serverResponse: Record<ServerActionEnum, ServerResponseHandler> = {
  [ServerActionEnum.endStep]: endStep,
  [ServerActionEnum.discard]: discard,
  [ServerActionEnum.drawCard]: drawCard,
  [ServerActionEnum.drawStep]: drawStep,
  [ServerActionEnum.produceAtFactory]: () => {}, // the optimistic response is fine
  [ServerActionEnum.buildFactory]: () => {}, // the optimistic response is fine
  [ServerActionEnum.unassignEmployee]: () => {}, // the optimistic response is fine
  [ServerActionEnum.hireEmployee]: () => {}, // the optimistic response is fine
  [ServerActionEnum.assignEmployee]: () => {}, // the optimistic response is fine
  [ServerActionEnum.reserveFactory]: () => {}, // the optimistic response is fine
  [ServerActionEnum.produceStep]: produceStep,
  [ServerActionEnum.purchaseStep]: purchaseStep,
  [ServerActionEnum.assignWorkers]: assignmentStep,
  [ServerActionEnum.revealMarket]: revealMarket,
  [ServerActionEnum.startRound]: startRound,
  [ServerActionEnum.endRound]: endRound,
};
