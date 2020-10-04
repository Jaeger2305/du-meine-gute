import { GameState, PlayerState } from "../../types";

export function endStep(gameState: GameState, playerState: PlayerState) {
  playerState.availableActions = [];
}
