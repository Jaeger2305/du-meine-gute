import { GameState, PlayerState } from "../../types";
import { revealMarket } from "./reveal-market";
import { assignWorkers } from "./assign-workers";
import { ServerActionResponse } from "../types";
import { draw } from "./draw";
import { startRound } from "./start-round";
import { endRound } from "./end-round";

export const roundSteps: Array<(
  serverState: GameState,
  playerNumber: number
) => ServerActionResponse> = [
  startRound,
  draw,
  revealMarket,
  assignWorkers,
  revealMarket,
  endRound,
];
