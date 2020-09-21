import { GameState, Card, Resource, PlayerActionEnum } from "../../types";
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
