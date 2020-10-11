import { GameState } from "../../types";
import { revealMarket } from "./reveal-market";
import { assignmentStep } from "./assignment-step";
import { ServerActionResponse } from "../types";
import { drawStep } from "./draw-step";
import { startRound } from "./start-round";
import { endRound } from "./end-round";

export const roundSteps: Array<(
  serverState: GameState,
  playerNumber: number
) => ServerActionResponse> = [
  startRound,
  drawStep,
  revealMarket,
  assignmentStep,
  revealMarket,
];
