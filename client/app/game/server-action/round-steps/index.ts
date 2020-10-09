import { GameState, PlayerState } from "../../types";
import { revealMarket } from "./reveal-market";
import { ServerActionResponse } from "../types";
import { draw } from "./draw";
import { startRound } from "./start-round";
import { endRound } from "./end-round";

export const roundSteps: Array<(
  gameState: GameState,
  playerState: PlayerState
) => ServerActionResponse> = [
  startRound,
  draw,
  revealMarket,
  revealMarket,
  endRound,
];
