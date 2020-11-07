import { EndStepResponse } from "../server-action/types";
import {
    GameState,
    PlayerState,
  } from "../types";

export function endStep(
    gameState: GameState,
    playerState: PlayerState,
    { availableActions, activeStep }: EndStepResponse["response"]
  ): void {
    gameState.activeStep = activeStep
    // In a multi player game, the end step probably won't immediately return the next steps.
    playerState.availableActions.splice(
      0,
      playerState.availableActions.length,
      ...availableActions
    );
  };