import {
  PlayerState,
  Resource,
  PlayerActionEnum,
  GameState,
  Card,
} from "../../types";
import { sortBy, sumBy, shuffle } from "lodash";

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
    (action) => action.type === actionToRemove
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
  } else {
    return null;
  }

  const drawnCards = cardsInDeck.splice(0, 1);
  return drawnCards[0];
}
