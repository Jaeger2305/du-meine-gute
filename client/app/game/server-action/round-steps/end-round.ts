import { sum } from "lodash";
import {
  AssignedEmployee,
  GameState,
  ServerActionEnum,
  EmployeeType,
} from "../../types";
import { PlayerActionEnum } from "../../client";
import { EndRoundResponse, LogLevel } from "../types";

/**
 * Initiate the final step in the round
 * Check if there is a game end condition (if a player has 8 buildings), and tot up the scores.
 * Returns the valid actions that can be performed for this round.
 * Either acknowledge and a return to the startRound action, or nothing, meaning the game has ended and all they can do is leave.
 */
export function endRound(
  serverState: GameState,
  playerNumber: number
): EndRoundResponse {
  const playerState = serverState.players[playerNumber];
  const isGameEnd = serverState.isGameEnding; // if marked as game ending last round, mark as finished here.
  serverState.isGameEnding =
    playerState.cardsInPlay.length >= serverState.config.buildCountForEndGame;
  playerState.availableActions = isGameEnd ? [] : [PlayerActionEnum.endStep];
  serverState.winner = isGameEnd ? playerState.player : null;
  const resourcesScore = Math.floor(
    sum(playerState.resources.map((resource) => resource.value)) *
      serverState.config.pointsPerResource
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
  if (serverState.isGameEnding) {
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
        type: EmployeeType.Investor,
        mode: { productionCount: 1, resourceSparingCount: 0 },
        unassignmentCost: 0,
        assignment: factory,
        hasProduced: false,
      })
    );
    playerState.assignedEmployees.push(...investorAssignments);
  }

  // Discard the market
  const discardedCards = [...serverState.marketCards];
  serverState.cardsInDiscard.push(...discardedCards);
  serverState.marketCards = [];

  return {
    type: ServerActionEnum.endRound,
    isOK: true,
    logLevel: LogLevel.Visible,
    response: {
      discardedCards,
      assignedEmployees: playerState.assignedEmployees,
      winner: serverState.winner,
      isGameEnding: serverState.isGameEnding,
      availableActions: serverState.players[playerNumber].availableActions,
      score: playerState.score,
    },
  };
}
