import {
  AssignedEmployee,
  Card,
  GameState,
  PlayerActionEnum,
  PlayerState,
} from "../../types";
import { Resource } from "../../resources";
import {
  removeActionFromAvailableActions,
  produceGood,
  discardCards,
} from "../../utils";

export async function produceAtFactory(
  gameState: GameState,
  playerState: PlayerState,
  {
    discardedCards,
    outputResources,
    consumedResources,
    assignedEmployee: proposedAssignedEmployee,
  }: {
    discardedCards: Array<Card>;
    outputResources: Array<Resource>;
    consumedResources: Array<Resource>;
    assignedEmployee: AssignedEmployee;
  }
): Promise<{
  discardedCards: Array<Card>;
  outputResources: Array<Resource>;
  consumedResources: Array<Resource>;
  assignedEmployee: AssignedEmployee;
}> {
  // Find the player state employee for later mutations
  const assignedEmployee = playerState.assignedEmployees.find(
    ({ name }) => name === proposedAssignedEmployee.name
  );

  assignedEmployee.hasProduced = true;

  discardCards(discardedCards, playerState.cardsInHand);

  // Add the resources to the players bank
  outputResources.forEach((outputResource) =>
    produceGood(gameState, playerState, outputResource, true)
  );

  // Remove the consumed resources
  consumedResources.forEach(({ type: consumedType }) => {
    const consumedIndex = playerState.resources.findIndex(
      ({ type }) => type === consumedType
    );
    if (consumedIndex < 0)
      throw new Error(
        `could not find resource ${consumedType} in player's resources`
      );

    playerState.resources.splice(consumedIndex, 1);
  });

  // If there are no more workers to produce at, remove the available step
  if (playerState.assignedEmployees.every(({ hasProduced }) => hasProduced)) {
    removeActionFromAvailableActions(
      playerState,
      PlayerActionEnum.produceAtFactory
    );
  }

  return {
    discardedCards,
    outputResources,
    consumedResources,
    assignedEmployee: proposedAssignedEmployee,
  };
}
