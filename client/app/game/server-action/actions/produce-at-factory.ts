import { LogLevel, ProduceAtFactoryResponse, ServerActionEnum } from "../types";
import { GameState, PlayerState, AssignedEmployee, Card } from "../../types";
import { Resource } from "../../resources";
import { removeActionFromAvailableActions, produceGood } from "../../utils";
import { PlayerActionEnum } from "../../client";

export function produceAtFactory(
  serverState: GameState,
  playerNumber: PlayerState["playerNumber"],
  {
    discardedCards,
    consumedResources,
    outputResources,
    assignedEmployee: proposedAssignedEmployee,
  }: {
    discardedCards: Array<Card>;
    consumedResources: Array<Resource>;
    outputResources: Array<Resource>;
    assignedEmployee: AssignedEmployee;
  }
): ProduceAtFactoryResponse {
  console.warn(
    "The produce at factor server action is very similar to the client side optimistic update, but this should be doing extra validation"
  );
  const playerState = serverState.players[playerNumber];
  // Find the player state employee for later mutations
  const assignedEmployee = playerState.assignedEmployees.find(
    ({ name }) => name === proposedAssignedEmployee.name
  );

  assignedEmployee.hasProduced = true;

  // Mutate out the discarded cards from the player's hand
  const indexesOfCardsToRemove = discardedCards
    .map(({ name: discardedCardName }) =>
      playerState.cardsInHand.findIndex(
        ({ name: cardInHandName }) => discardedCardName === cardInHandName
      )
    )
    .sort((a, b) => b - a); // descending, for easy index safe deleting

  indexesOfCardsToRemove.forEach((indexToRemove) =>
    playerState.cardsInHand.splice(indexToRemove, 1)
  );

  // Add the resources to the players bank
  outputResources.forEach((outputResource) =>
    produceGood(serverState, playerState, outputResource, false)
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
    type: ServerActionEnum.produceAtFactory,
    isOK: true,
    logLevel: LogLevel.Visible,
    response: {},
  };
}
