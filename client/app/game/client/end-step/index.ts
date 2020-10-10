import { GameState, PlayerState } from "../../types";
import { roundSteps } from "../../server-action";

export function endStep(gameState: GameState, playerState: PlayerState) {
  playerState.availableActions.splice(0, playerState.availableActions.length);
  gameState.activeStep = (gameState.activeStep + 1)  % roundSteps.length
}
