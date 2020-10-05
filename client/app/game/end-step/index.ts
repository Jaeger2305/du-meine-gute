import { GameState, PlayerState } from "../../../../cli/types";

export function endStep(gameState: GameState, playerState: PlayerState) {
  playerState.availableActions.splice(0, playerState.availableActions.length);
}
