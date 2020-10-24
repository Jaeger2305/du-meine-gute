import { EndRoundResponse } from "../server-action/types";
import { GameState, PlayerState } from "../types";

export function endRound(
  gameState: GameState,
  playerState: PlayerState,
  {
    discardedCards,
    assignedEmployees,
    winner,
    isGameEnding,
    availableActions,
    score,
  }: EndRoundResponse["response"]
): void {
  gameState.winner = winner;
  gameState.isGameEnding = isGameEnding;
  gameState.winner = winner;
  playerState.score = score;
  playerState.assignedEmployees.splice(
    0,
    playerState.assignedEmployees.length,
    ...assignedEmployees
  );
  gameState.cardsInDiscard.push(...discardedCards);
  playerState.availableActions.splice(
    0,
    playerState.availableActions.length,
    ...availableActions
  );
}
