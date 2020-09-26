import * as prompts from "prompts";
import { GameState, PlayerActionEnum, Card } from "../../types";
import {
  filterCardsToAffordable,
  removeActionFromAvailableActions,
  verifyResources,
} from "../utils";
import { buildFactory as serverBuildFactory } from "../../local-server";

export async function buildFactory(gameState: GameState) {
  // Filter cards to those that can be afforded
  const affordableCards = filterCardsToAffordable(
    [gameState.reservedFactory].filter(Boolean),
    (card: Card) => card.cost,
    gameState.resources
  );

  // Short circuit if nothing found
  if (!affordableCards.length)
    return removeActionFromAvailableActions(
      gameState,
      PlayerActionEnum.buildFactory
    );

  // Pick a card to build
  const cardChoice = await prompts({
    type: "select",
    message: `pick an card to play`,
    name: "card",
    choices: affordableCards.map((card) => ({
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
    response: { cardsInPlay, reservedFactory, availableActions, resources },
  } = serverBuildFactory(gameState, cardChoice.card, resourcesChoice.resources);

  // Update state with results
  // We should probably optimistically update, and if the response doesn't match, throw an error and restore from state.
  gameState.cardsInPlay = cardsInPlay;
  gameState.reservedFactory = reservedFactory;
  gameState.availableActions = availableActions;
  gameState.resources = resources;
  return;
}
