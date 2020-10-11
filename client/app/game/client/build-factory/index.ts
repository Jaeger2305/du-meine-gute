import { GameState, PlayerState } from "../../types";
import { payForFactory } from "./build-factory-utils";
import { Resource } from '../../resources';

export function buildFactory(
  gameState: GameState,
  playerState: PlayerState,
  { resources }: {
    resources: Array<Resource>,
  },
): {
  resources: Array<Resource>,
} {
  // Optimistically update
  payForFactory(gameState, playerState, resources);
  playerState.reservedFactory = null;
  return {
    resources
  };
}
