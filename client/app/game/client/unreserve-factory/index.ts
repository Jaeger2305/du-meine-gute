import { GameState, PlayerActionEnum, PlayerState } from "../../types";
import { removeActionFromAvailableActions } from "../../utils";

export function unreserveFactory(
  gameState: GameState,
  playerState: PlayerState
): null {
  if (!playerState.reservedFactory) throw new Error("No factory present");
  playerState.cardsInHand.push(playerState.reservedFactory);

  playerState.reservedFactory = null;

  removeActionFromAvailableActions(
    playerState,
    PlayerActionEnum.unreserveFactory
  );
  return null;
}
