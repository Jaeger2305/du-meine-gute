import * as prompts from "prompts";
import { Employee, GameState, PlayerActionEnum } from "../../types";
import {
  filterCardsToAffordable,
  removeActionFromAvailableActions,
  verifyResources,
} from "../utils";
import { hireWorker as serverHireWorker } from "../../local-server";
import { differenceBy } from "lodash";

export async function hireWorker(gameState: GameState): Promise<void> {
  // Filter cards to those that can be afforded
  const affordableCards = filterCardsToAffordable<Employee>(
    gameState.availableEmployees,
    (card: Employee) => card.cost,
    gameState.resources
  );

  // Filter cards according to their prerequisites
  const factoryTypesInPlay = gameState.cardsInPlay.map(
    (factory) => factory.resource
  );
  const availableCards = affordableCards.filter(
    (card) =>
      !differenceBy(card.resourceSpecialty, factoryTypesInPlay, "type").length
  );

  // Short circuit if nothing found
  if (!availableCards.length)
    return removeActionFromAvailableActions(
      gameState,
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
    choices: gameState.resources
      .map((resource, index) => ({
        title: `${resource.type} - ${resource.value}`,
        value: { ...resource, originalIndex: index },
      }))
      .filter((resource) => resource.value),
  });

  // Verify resources are not under or wasted
  if (!verifyResources(resourcesChoice.resources, cardChoice.card.cost)) return;

  // Submit to server
  const {
    response: { employees, availableEmployees, availableActions, resources },
  } = serverHireWorker(gameState, cardChoice.card, resourcesChoice.resources);

  // Update state with results
  // We should probably optimistically update, and if the response doesn't match, throw an error and restore from state.
  gameState.employees = employees;
  gameState.availableEmployees = availableEmployees;
  gameState.availableActions = availableActions;
  gameState.resources = resources;
  return;
}
