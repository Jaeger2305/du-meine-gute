import { RevealMarketResponse } from "../server-action/types";
import {
    GameState,
    PlayerState,
  } from "../types";

export function startRound (
  gameState: GameState,
  playerState: PlayerState,
  { availableActions }: RevealMarketResponse["response"]
): void {
  gameState.marketCards.splice(0, gameState.marketCards.length)
  playerState.availableActions.splice(0, playerState.availableActions.length, ...availableActions)
};