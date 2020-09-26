import * as prompts from "prompts";
import { produceGood } from "../../local-server";
import { GameState, Resource } from "../../types";
import { playerActions } from "../index";
import {
  checkOutstandingResources,
  fallbackProduction,
} from "./production-utils";

export async function produceAtFactory(gameState: GameState): Promise<void> {
  // Filter to fresh workers
  const readyWorkers = gameState.assignedEmployees
    .map((factoryWorker, index) => ({ ...factoryWorker, index }))
    .filter((employee) => !employee.hasProduced);

  const factoryChoice = await prompts({
    type: "select",
    message: `pick an assigned worker`,
    name: "factoryWorker",
    choices: readyWorkers.map((factoryWorker) => ({
      title: factoryWorker.name,
      value: factoryWorker,
    })),
  });

  // Copy initial market resources, and in play boosts
  const marketResources = [
    ...gameState.marketCards.map((card) => card.resource),
    ...gameState.cardsInPlay
      .flatMap((card) => card.marketBoost)
      .filter(Boolean),
  ];

  // Loop asking for a card to discard until all are chosen.
  let canProduce = true;
  let hasProduced = false;
  while (canProduce) {
    const inputResources =
      hasProduced && factoryChoice.factoryWorker.assignment.chainInput
        ? [...factoryChoice.factoryWorker.assignment.chainInput]
        : [...factoryChoice.factoryWorker.assignment.input];
    // Check if can use the market resources
    const {
      isEnoughToProduce,
      requiredExtraResources,
    } = checkOutstandingResources(
      inputResources, // should toggle based on has produced
      marketResources,
      hasProduced
        ? 0 // the discount applies only to the first production
        : factoryChoice.factoryWorker.mode.resourceSparingCount
    );

    if (isEnoughToProduce) {
      canProduce = true;
    } else {
      const { fallbackSuccess, cardIndexesToDelete } = await fallbackProduction(
        requiredExtraResources,
        gameState.cardsInHand,
        marketResources,
        factoryChoice.factoryWorker
      );
      cardIndexesToDelete.forEach((cardIndexToDelete) => {
        gameState.cardsInDiscard.push(gameState.cardsInHand[cardIndexToDelete]);
        gameState.cardsInHand.splice(cardIndexToDelete, 1);
      }); // it's not nice to mutate the game state here.
      canProduce = fallbackSuccess;
    }

    // Produce the resource
    if (canProduce) {
      console.log("producing the resource");
      // Remove the market used resources
      while (inputResources.length) {
        const resourceIndex = marketResources.findIndex(
          (resource) => inputResources[0] === resource
        );
        inputResources.shift();
        if (resourceIndex > -1) gameState.marketCards.splice(resourceIndex, 1); // it might not be found in case this was spared because the worker was efficient.
      }

      // Add the resources to the game state
      // First production depends on the worker, but chains do not.
      const producedResources: Array<Resource> = new Array(
        hasProduced ? 1 : factoryChoice.factoryWorker.mode.productionCount
      )
        .fill(factoryChoice.factoryWorker.assignment.output)
        .flat();
      // Draw card from deck to represent the resource
      producedResources.forEach((resource) => {
        ({
          response: {
            resources: gameState.resources,
            cardsInDiscard: gameState.cardsInDiscard,
            cardsInDeck: gameState.cardsInDeck,
          },
        } = produceGood(gameState, resource));
      });

      // If the assignment allows only one production and no chaining, production can no longer happen.
      if (!factoryChoice.factoryWorker.assignment.chainInput)
        canProduce = false;

      hasProduced = true;
    }
  }

  // Indicate the worker has produced this round.
  gameState.assignedEmployees[
    factoryChoice.factoryWorker.index
  ].hasProduced = true;
  // Remove the assigned worker if free to do so
  if (factoryChoice.factoryWorker.unassignmentCost === 0) {
    gameState.assignedEmployees.splice(factoryChoice.factoryWorker.index, 1);
  }

  // if there are no more workers to produce at, remove the available step
  if (
    !gameState.assignedEmployees.filter((employee) => !employee.hasProduced)
      .length
  ) {
    const indexOfProductionAction = gameState.availableActions.findIndex(
      (action) => action.type === playerActions.produceAtFactory.type
    );
    if (indexOfProductionAction < 0)
      throw new Error("We were expecting a production action here.");

    gameState.availableActions.splice(indexOfProductionAction, 1);
  }
}
