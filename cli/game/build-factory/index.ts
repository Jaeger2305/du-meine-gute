import * as prompts from "prompts";
import { GameState, PlayerState, PlayerActionEnum, Card } from "../../types";
import {
  filterCardsToAffordable,
  removeActionFromAvailableActions,
  verifyResources,
} from "../utils";
import { payForFactory } from "./build-factory-utils";
import { buildFactory as serverBuildFactory } from "../../local-server";

export async function buildFactory(
  gameState: GameState,
  playerState: PlayerState
) {
  // Filter cards to those that can be afforded
  const affordableCards = filterCardsToAffordable<Card>(
    [playerState.reservedFactory].filter(Boolean),
    (card: Card) => card.cost,
    playerState.resources
  );

  // Short circuit if nothing found
  if (!affordableCards.length)
    return removeActionFromAvailableActions(
      playerState,
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
  serverBuildFactory(gameState, playerState, resourcesChoice.resources);

  // Optimistically update
  payForFactory(gameState, playerState, resourcesChoice.resources);
  playerState.reservedFactory = null;
  return;
}
