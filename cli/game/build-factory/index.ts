import * as prompts from "prompts";
import { GameState, Card, Resource, PlayerActionEnum } from "../../types";
import { playCard as serverPlayCard } from "../../local-server";
import { sortBy, sumBy } from "lodash";

export function filterCardsToAffordable(
  cards: Array<Card>,
  resources: Array<Resource>
): Array<Card> {
  // tot up resources
  const money = sumBy(resources, "value");

  // filter cards to those costing less than resource total
  return cards.filter((card) => card.cost <= money);
}

export function removeBuildActionFromAvailableActions({
  availableActions,
}: GameState): void {
  const index = availableActions.findIndex(
    (action) => action.type === PlayerActionEnum.buildFactory
  );
  if (index === -1)
    throw new Error(
      "the build factory action wasn't available, but this shouldn't be possible yet."
    );

  availableActions.splice(index, 1);
  return;
}

export function verifyResources(
  resources: Array<Resource>,
  costOfBuilding: number
): boolean {
  if (!resources.length) return false;
  if (resources.find((resource) => resource.value === 0)) return false;

  const selectionValue = sumBy(resources, "value");
  const isAffordable = selectionValue >= costOfBuilding;

  const cheapestResource = sortBy(resources, "value")[0];
  const isExcessive = selectionValue - cheapestResource.value >= costOfBuilding;

  return isAffordable && !isExcessive;
}

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
