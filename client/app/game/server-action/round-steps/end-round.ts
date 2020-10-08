import { sum } from "lodash";
import { playerActions } from "../../client";
import { AssignedEmployee, GameState, PlayerState } from "../../types";
import { ServerResponse } from "../types";

/**
 * Initiate the final step in the round
 * Check if there is a game end condition (if a player has 8 buildings), and tot up the scores.
 * Returns the valid actions that can be performed for this round.
 * Either acknowledge and a return to the startRound action, or nothing, meaning the game has ended and all they can do is leave.
 */
export function endRound(
  gameState: GameState,
  playerState: PlayerState
): ServerResponse {
  const isGameEnd = gameState.isGameEnding; // if marked as game ending last round, mark as finished here.
  gameState.isGameEnding =
    playerState.cardsInPlay.length >= gameState.config.buildCountForEndGame;
  playerState.availableActions = isGameEnd ? [] : [playerActions.endStep];
  gameState.winner = isGameEnd ? playerState.player : null;
  const resourcesScore = Math.floor(
    sum(playerState.resources.map((resource) => resource.value)) *
      gameState.config.pointsPerResource
  );
  const factoryScore = sum(playerState.cardsInPlay.map((card) => card.points));
  const employeeScore = sum(
    playerState.employees.map((employee) => employee.points)
  );
  playerState.score = sum([resourcesScore, factoryScore, employeeScore]);

  console.log("current score: ", playerState.score);

  // Reset worker production states
  playerState.assignedEmployees = playerState.assignedEmployees.map(
    (employee) => ({
      ...employee,
      hasProduced: false,
    })
  );

  // If at the end of the game, assign investors for free.
  if (gameState.isGameEnding) {
    const assignedFactories = playerState.assignedEmployees.map(
      (employee) => employee.assignment.name
    );
    const unassignedFactories = playerState.cardsInPlay.filter(
      (card) => !assignedFactories.includes(card.name) && card.productionConfig
    );
    const investorAssignments: Array<AssignedEmployee> = unassignedFactories.map(
      (factory, index) => ({
        name: `investor ${index} - ${
          factory.name
        } - ${factory.productionConfig.output.join()}`,
        mode: { productionCount: 1, resourceSparingCount: 0 },
        unassignmentCost: 0,
        assignment: factory,
      })
    );
    playerState.assignedEmployees.push(...investorAssignments);
  }

  // Discard the market
  gameState.cardsInDiscard.push(...gameState.marketCards);
  gameState.marketCards = [];

  return {
    response: {
      assignedEmployees: playerState.assignedEmployees,
      availableActions: playerState.availableActions,
      winner: gameState.winner,
    },
  };
}
