import * as prompts from "prompts";
import { GameState } from "../../types";
import {
  filterCardsToAffordable,
  removeBuildActionFromAvailableActions,
  verifyResources,
} from "./build-factory-utils";
import { playCard as serverPlayCard } from "../../local-server";

export async function buildFactory(gameState: GameState) {
  // Filter cards to those that can be afforded
  const affordableCards = filterCardsToAffordable(
    gameState.cardsInHand,
    gameState.resources
  );

  // Short circuit if nothing found
  if (!affordableCards.length)
    return removeBuildActionFromAvailableActions(gameState);

  // Pick a card to build
  const cardChoice = await prompts({
    type: "select",
    message: `pick an card to play`,
    name: "card",
    choices: gameState.cardsInHand.map((card) => ({
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
    response: { cardsInPlay, cardsInHand, availableActions, resources },
  } = serverPlayCard(gameState, cardChoice.card, resourcesChoice.resources);

  // Update state with results
  // We should probably optimistically update, and if the response doesn't match, throw an error and restore from state.
  gameState.cardsInPlay = cardsInPlay;
  gameState.cardsInHand = cardsInHand;
  gameState.availableActions = availableActions;
  gameState.resources = resources;
  return;
}
