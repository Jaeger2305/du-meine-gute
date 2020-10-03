import * as prompts from "prompts";
import {
  Employee,
  GameState,
  PlayerActionEnum,
  PlayerState,
} from "../../types";
import {
  filterCardsToAffordable,
  removeActionFromAvailableActions,
  verifyResources,
} from "../utils";
import { hireWorker as serverHireWorker } from "../../local-server/actions/hire-worker";
import { differenceBy } from "lodash";
import { payForWorker } from "./hire-worker-utils";

export async function hireWorker(
  gameState: GameState,
  playerState: PlayerState
): Promise<void> {
  // Filter cards to those that can be afforded
  const affordableCards = filterCardsToAffordable<Employee>(
    gameState.availableEmployees,
    (card: Employee) => card.cost,
    playerState.resources
  );

  // Filter cards according to their prerequisites
  const factoryTypesInPlay = playerState.cardsInPlay.map(
    (factory) => factory.resource
  );
  const availableCards = affordableCards.filter(
    (card) =>
      !differenceBy(card.resourceSpecialty, factoryTypesInPlay, "type").length
  );

  // Short circuit if nothing found
  if (!availableCards.length)
    return removeActionFromAvailableActions(
      playerState,
      PlayerActionEnum.hireWorker
    );

  // Pick a card to build
  const cardChoice = await prompts({
    type: "select",
    message: `pick an card to play`,
    name: "card",
    choices: availableCards.map((card) => ({
      title: card.name,
      value: card,
    })),
  });

  // Short circuit if aborted
  if (!cardChoice) return;

  // Pick resource combinations
  const resourcesChoice = await prompts({
    type: "multiselect",
    message: `pick resources to spend`,
    name: "resources",
    choices: playerState.resources
      .map((resource, index) => ({
        title: `${resource.type} - ${resource.value}`,
        value: { ...resource, originalIndex: index },
      }))
      .filter((resource) => resource.value),
  });

  // Verify resources are not under or wasted
  if (!verifyResources(resourcesChoice.resources, cardChoice.card.cost)) return;

  // Notify server
  serverHireWorker(
    gameState,
    playerState,
    cardChoice.card,
    resourcesChoice.resources
  );

  // Optimistically update
  payForWorker(
    gameState,
    playerState,
    cardChoice.card,
    resourcesChoice.resources
  );
}
