import {
  GameState,
  Card,
  Resource,
  PlayerActionEnum,
  Employee,
  AssignedEmployee,
} from "../../types";
import { sortBy, sumBy } from "lodash";

export function filterCardsToAffordable(
  cards: Array<Card | Employee | AssignedEmployee>,
  costExtractor: (card: any) => number,
  resources: Array<Resource>
): Array<Card | Employee | AssignedEmployee> {
  // tot up resources
  const money = sumBy(resources, "value");

  // filter cards to those costing less than resource total
  return cards.filter((card) => costExtractor(card) <= money);
}

export function removeActionFromAvailableActions(
  { availableActions }: GameState,
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
