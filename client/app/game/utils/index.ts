import {
  PlayerState,
  GameState,
  Card,
  AssignedEmployee,
  Employee,
  BuildingType,
} from "../types";
import { unknown } from "../cards";
import { PlayerActionEnum } from "../client";

import { Resource } from "../resources";
import { sortBy, sumBy, shuffle, groupBy } from "lodash";

export { checkOutstandingResources, produceGood } from "./production-utils";

export function filterCardsToAffordable<T>(
  cards: Array<T>,
  costExtractor: (card: T) => number,
  resources: Array<Resource>
): Array<T> {
  // tot up resources
  const money = sumBy(resources, "value");

  // filter cards to those costing less than resource total
  return cards.filter((card) => costExtractor(card) <= money);
}

export function removeActionFromAvailableActions(
  { availableActions }: PlayerState,
  actionToRemove: PlayerActionEnum
): void {
  const index = availableActions.findIndex(
    (action) => action === actionToRemove
  );
  if (index === -1)
    throw new Error(
      `the ${actionToRemove} action wasn't available, but this shouldn't be possible yet.`
    );

  availableActions.splice(index, 1);
  return;
}

/**
 * Checks if the value of the input resources is sufficient, and not excessibe, for the cost of purchase
 * @param resources
 * @param costOfPurchase
 */
export function verifyResources(
  resources: Array<Resource>,
  costOfPurchase: number
): boolean {
  if (!resources.length) return false;
  if (resources.find((resource) => resource.value === 0)) return false;

  const selectionValue = sumBy(resources, "value");
  const isAffordable = selectionValue >= costOfPurchase;

  const cheapestResource = sortBy(resources, "value")[0];
  const isExcessive = selectionValue - cheapestResource.value >= costOfPurchase;

  return isAffordable && !isExcessive;
}

export function spendResources(
  reservedCards: GameState["reservedCards"],
  cardsInDiscard: GameState["cardsInDiscard"],
  resources: PlayerState["resources"],
  resourcePayment: Array<Resource>
): void {
  if (resourcePayment.length > reservedCards.length)
    throw new Error("not enough cards reserved for resource selection");

  const resourcesAfterPayment = differenceResources(resources, resourcePayment);
  const isSufficientResources =
    resources.length - resourcesAfterPayment.length === resourcePayment.length;
  if (!isSufficientResources)
    throw new Error("not enough resources for the payment");

  const usedResources = reservedCards.splice(0, resourcePayment.length);
  cardsInDiscard.push(...usedResources);
  resources.splice(0, resources.length, ...resourcesAfterPayment);
}

function shuffleDiscard(
  cardsInDeck: Array<Card>,
  cardsInDiscard: Array<Card>
): Array<Card> {
  if (cardsInDeck.length) {
    throw new Error("The deck is expected to be empty");
  }

  return shuffle(cardsInDiscard);
}

export function drawFromDeck(
  cardsInDeck: Array<Card>,
  cardsInDiscard: Array<Card>
): Card | null {
  if (!cardsInDeck.length && cardsInDiscard.length) {
    const shuffledDiscard = shuffleDiscard(cardsInDeck, cardsInDiscard);
    cardsInDeck.splice(0, cardsInDeck.length, ...shuffledDiscard);
    cardsInDiscard.splice(0, cardsInDiscard.length);
  } else if (!cardsInDeck.length) {
    return null;
  }

  const drawnCards = cardsInDeck.splice(0, 1);
  return drawnCards[0];
}

export function assignUnknownCard(
  knownCard: Card,
  mixedCards: Array<Card>
): void {
  const unknownCard = mixedCards.find(
    (card) => card.type === BuildingType.unknown
  );
  if (!unknownCard) {
    throw new Error(
      "An unknown card was expected here to populate - maybe it already completed."
    );
  }
  Object.assign(unknownCard, knownCard);
}

export function discardCards(
  cardsToDiscard: Array<Card>,
  cards: Array<Card>
): void {
  // Mutate out the discarded cards from the player's hand
  const indexesOfCardsToRemove = cardsToDiscard
    .map(({ name: cardNameToDiscard }) => {
      const cardIndexToDiscard = cards.findIndex(
        ({ name }) => name === cardNameToDiscard
      );
      if (cardIndexToDiscard < 0)
        throw new Error(
          `attempted to discard a card that isn't in hand ${cardNameToDiscard}`
        );
      return cardIndexToDiscard;
    })
    .sort((a, b) => b - a); // descending, for easy index safe deleting

  indexesOfCardsToRemove.forEach((indexToRemove) =>
    cards.splice(indexToRemove, 1)
  );
}

/**
 * Lodash's difference creates a unique array, which isn't always desired.
 * So, roll a custom implementation that does a true difference.
 * Simplest to use a for loop filter, but this isn't particularly optimised for efficiency or readability, just speed of writing code.
 * @param originalResources
 * @param resourcesToRemove
 */
export function differenceResources(
  originalResources: Array<Resource>,
  resourcesToRemove: Array<Resource>
): Array<Resource> {
  // [1,2,2,3,5], [2,4] -> [1,2,3,5]
  const copyOriginalResources = originalResources.slice();
  resourcesToRemove.forEach((resource) => {
    const indexToDelete = copyOriginalResources.findIndex(
      (originalResource) => originalResource.type === resource.type
    );
    if (indexToDelete > -1) copyOriginalResources.splice(indexToDelete, 1);
  });
  return copyOriginalResources;
}

export function isActionAvailable(
  availableActions: PlayerState["availableActions"],
  action: PlayerActionEnum
) {
  return Boolean(
    availableActions.find((availableAction) => availableAction === action)
  );
}

// This should be a shared util function, but quick for now whilst PoC
export function createUnknownCard(baseCard: Card = unknown): Card {
  return { ...unknown, ...baseCard };
}

export function obfuscateDeck(
  cardsInDeck: GameState["cardsInDeck"]
): GameState["cardsInDeck"] {
  return cardsInDeck.map(createUnknownCard);
}

export function getUnassignedEmployees(
  employees: Array<Employee>,
  assignedEmployees: Array<AssignedEmployee>
): Array<Employee> {
  return employees.filter(
    (employee) =>
      !assignedEmployees
        .map((assignedEmployee) => assignedEmployee.name)
        .includes(employee.name)
  );
}

export function getUnoccupiedFactories(
  assignedEmployees: Array<AssignedEmployee>,
  factories: Array<Card>
): Array<Card> {
  return factories.filter(
    (factory) =>
      factory.productionConfig &&
      !assignedEmployees
        .map((assignedEmployee) => assignedEmployee.assignment.name)
        .includes(factory.name)
  );
}

export function aggregateResources(resources: Array<Resource> = []) {
  const aggregatedResources = groupBy<Resource>(resources, "type");
  return Object.values(aggregatedResources).map((resources) => ({
    resource: resources[0],
    count: resources.length,
  }));
}
