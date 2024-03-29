import * as prompts from "prompts";
import { produceGood as serverProduceGood } from "../../local-server/actions/produce-good";
import {
  AssignedEmployee,
  GameState,
  PlayerActionEnum,
  PlayerState,
} from "../../types";
import { Resource, ResourceType } from "../../resources";
import { removeActionFromAvailableActions } from "../utils";
import {
  checkOutstandingResources,
  fallbackProduction,
  produceGood,
} from "./production-utils";

export async function produceAtFactory(
  gameState: GameState,
  playerState: PlayerState
): Promise<void> {
  // Filter to fresh workers
  const readyWorkers = playerState.assignedEmployees
    .map((factoryWorker, index) => ({ ...factoryWorker, index }))
    .filter((employee) => !employee.hasProduced);

  const factoryChoice: {
    factoryWorker: AssignedEmployee & { index: number };
  } = await prompts({
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
    ...playerState.cardsInPlay
      .flatMap((card) => card.marketBoost)
      .filter(Boolean),
  ];

  // Loop asking for a card to discard until all are chosen.
  let canProduce = true;
  let hasProduced = false;
  while (canProduce) {
    const inputResources =
      hasProduced &&
      factoryChoice.factoryWorker.assignment.productionConfig.chainInput
        ? [
            ...factoryChoice.factoryWorker.assignment.productionConfig
              .chainInput,
          ]
        : [...factoryChoice.factoryWorker.assignment.productionConfig.input];
    inputResources.sort((a) => (a.type === ResourceType.placeholder ? 1 : -1)); // Move placeholders to the end of the array. Functionally splitting this is probably cleaner, but slightly more complex.
    const canUseMarketResources = !hasProduced;
    // Check if can use the market resources
    const {
      isEnoughToProduce,
      requiredExtraResources,
    } = checkOutstandingResources(
      inputResources, // should toggle based on has produced
      canUseMarketResources ? marketResources : [], // the market can only be used for initial production
      hasProduced
        ? 0 // the discount applies only to the first production
        : factoryChoice.factoryWorker.mode.resourceSparingCount
    );

    if (isEnoughToProduce) {
      canProduce = true;
    } else {
      // There's a minor bug here - when fallback production fails because of invalid input, production is marked as finished.
      // It means making the wrong selection will cause the player to miss out on that resource.
      // Could be combatted by a refactor of this function, handling via clientside logic, or adding another parameter into the fallback production (invalidSelection)
      // This would help distinguish between when to retry the fallback production and when to mark as finished.
      const { fallbackSuccess, cardIndexesToDelete } = await fallbackProduction(
        requiredExtraResources,
        playerState.cardsInHand,
        canUseMarketResources ? marketResources : [],
        factoryChoice.factoryWorker
      );
      cardIndexesToDelete.forEach((cardIndexToDelete) => {
        gameState.cardsInDiscard.push(
          playerState.cardsInHand[cardIndexToDelete]
        );
        playerState.cardsInHand.splice(cardIndexToDelete, 1);
      }); // it's not nice to mutate the game state here.
      canProduce = fallbackSuccess;
    }

    // Produce the resource
    if (canProduce) {
      // Remove the market used resources
      while (inputResources.length) {
        const resourceIndex = marketResources.findIndex(
          (resource) =>
            inputResources[0].type === resource.type ||
            inputResources[0].type === ResourceType.placeholder // If it's a placeholder, use whatever is in the market. This requires placeholders to be at the end, sorted earlier.
        );
        inputResources.shift();
        // This breaks with multi players
        if (resourceIndex > -1) gameState.marketCards.splice(resourceIndex, 1); // it might not be found in case this was spared because the worker was efficient.
      }

      // Add the resources to the game state
      // First production depends on the worker, but chains do not.
      const chainProductionCount =
        factoryChoice.factoryWorker.assignment.productionConfig.chainInput?.filter(
          (resource) => !resource.baseResource
        ).length ?? 1;
      const producedResources: Array<Resource> = new Array(
        hasProduced
          ? chainProductionCount
          : factoryChoice.factoryWorker.mode.productionCount
      )
        .fill(factoryChoice.factoryWorker.assignment.productionConfig.output)
        .flat();
      // Draw card from deck to represent the resource
      producedResources.forEach((resource) =>
        produceGood(gameState, playerState, resource)
      );

      // If the assignment allows only one production and no chaining, production can no longer happen.
      if (!factoryChoice.factoryWorker.assignment.productionConfig.chainInput)
        canProduce = false;

      hasProduced = true;
    }
  }

  // Indicate the worker has produced this round.
  playerState.assignedEmployees[
    factoryChoice.factoryWorker.index
  ].hasProduced = true;
  // Remove the assigned worker if free to do so
  if (factoryChoice.factoryWorker.unassignmentCost === 0) {
    playerState.assignedEmployees.splice(factoryChoice.factoryWorker.index, 1);
  }

  // if there are no more workers to produce at, remove the available step
  if (
    !playerState.assignedEmployees.filter((employee) => !employee.hasProduced)
      .length
  ) {
    removeActionFromAvailableActions(
      playerState,
      PlayerActionEnum.produceAtFactory
    );
  }
}
