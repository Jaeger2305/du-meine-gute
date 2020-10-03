import { GameState, PlayerState } from "../../types";
import { revealMarket } from "./reveal-market";
import { ServerResponse } from "../types";
import { assignEmployees } from "./assign-employees";
import { draw } from "./draw";
import { produce } from "./produce";
import { purchase } from "./purchase";
import { startRound } from "./start-round";
import { endRound } from "./end-round";

export const roundSteps: Array<(
  gameState: GameState,
  playerState: PlayerState
) => ServerResponse> = [
  startRound,
  draw,
  revealMarket,
  assignEmployees,
  revealMarket,
  produce,
  purchase,
  endRound,
];
