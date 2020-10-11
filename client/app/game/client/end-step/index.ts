import { GameState, PlayerState } from "../../types";
import { PlayerActionEnum } from '..';

export function endStep(gameState: GameState, playerState: PlayerState) {
  playerState.availableActions.splice(0, playerState.availableActions.length, PlayerActionEnum.endStep);
}
