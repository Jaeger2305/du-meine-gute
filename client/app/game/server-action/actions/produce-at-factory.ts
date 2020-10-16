import { ServerActionResponse } from "../types";
import {
  GameState,
  ServerActionEnum,
  PlayerState,
  AssignedEmployee,
  Card,
} from "../../types";
import { Resource } from "../../resources";
import { produceGood } from "../../client/production/production-utils";
import { removeActionFromAvailableActions } from "../../utils";
import { PlayerActionEnum } from "../../client";

export function produceAtFactory(
  serverState: GameState,
  playerNumber: PlayerState["playerNumber"],
  {
    discardedCards,
    outputResources,
    assignedEmployee: proposedAssignedEmployee,
  }: {
    discardedCards: Array<Card>;
    outputResources: Array<Resource>;
    assignedEmployee: AssignedEmployee;
  }
): ServerActionResponse {
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

  // If there are no more workers to produce at, remove the available step
  if (playerState.assignedEmployees.every(({ hasProduced }) => hasProduced)) {
    removeActionFromAvailableActions(
      playerState,
      PlayerActionEnum.produceAtFactory
    );
  }

  return {
    type: null,
    isOK: true,
    response: {},
  };
}
