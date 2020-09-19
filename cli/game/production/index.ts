import * as prompts from "prompts";
import { GameState } from "../../types";
import { playerActions } from "../index";
import {
  checkOutstandingResources,
  fallbackProduction,
} from "./production-utils";

export async function produceAtFactory(gameState: GameState): Promise<void> {
  const factoryChoice = await prompts({
    type: "select",
    message: `pick an assigned worker`,
    name: "factoryWorker",
    choices: gameState.assignedEmployees.map((factoryWorker, index) => ({
      title: factoryWorker.name,
      value: { factoryWorker, index },
    })),
  });

  // Copy initial market resources
  const marketResources = [...gameState.marketResources];

  // Loop asking for a card to discard until all are chosen.
  let canProduce = true;
  let hasProduced = false;
  while (canProduce) {
    const inputResources =
      hasProduced &&
      factoryChoice.factoryWorker.factoryWorker.assignment.chainInput
        ? [...factoryChoice.factoryWorker.factoryWorker.assignment.chainInput]
        : [...factoryChoice.factoryWorker.factoryWorker.assignment.input];
    // Check if can use the market resources
    const {
      isEnoughToProduce,
      requiredExtraResources,
    } = checkOutstandingResources(
      inputResources, // should toggle based on has produced
      marketResources,
      hasProduced
        ? 0 // the discount applies only to the first production
        : factoryChoice.factoryWorker.factoryWorker.mode.resourceSparingCount
    );

    if (isEnoughToProduce) {
      canProduce = true;
    } else {
      const { fallbackSuccess, cardIndexesToDelete } = await fallbackProduction(
        requiredExtraResources,
        gameState.cardsInHand,
        marketResources,
        factoryChoice.factoryWorker.factoryWorker
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
        if (resourceIndex > -1) marketResources.splice(resourceIndex, 1); // it might not be found in case this was spared because the worker was efficient.
      }

      // Add the resources to the game state
      // First production depends on the worker, but chains do not.
      const producedResources = new Array(
        hasProduced
          ? 1
          : factoryChoice.factoryWorker.factoryWorker.mode.productionCount
      ).fill(factoryChoice.factoryWorker.factoryWorker.assignment.resource);
      gameState.resources.push(...producedResources);

      // If the assignment allows only one production and no chaining, production can no longer happen.
      if (!factoryChoice.factoryWorker.factoryWorker.assignment.chainInput)
        canProduce = false;

      hasProduced = true;
    }
  }

  // Remove the assigned worker
  gameState.assignedEmployees.splice(factoryChoice.factoryWorker.index, 1);

  // if there are no more workers to produce at, remove the available step
  if (!gameState.assignedEmployees.length) {
    const indexOfProductionAction = gameState.availableActions.findIndex(
      (action) => action.type === playerActions.produceAtFactory.type
    );
    if (indexOfProductionAction < 0)
      throw new Error("We were expecting a production action here.");

    gameState.availableActions.splice(indexOfProductionAction, 1);
  }
}
