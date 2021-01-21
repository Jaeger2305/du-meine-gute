import { RevealMarketResponse } from "../server-action/types";
import { GameState, PlayerState } from "../types";

export function unreserveFactory(
  gameState: GameState,
  playerState: PlayerState,
  { availableActions }: RevealMarketResponse["response"]
): void {
  playerState.availableActions.splice(
    0,
    playerState.availableActions.length,
    ...availableActions
  );
}
