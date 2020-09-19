import { difference, intersection } from "lodash";
import * as prompts from "prompts";
import { Resource, Card, AssignedEmployee } from "../../types";

export function checkOutstandingResources(
  requiredResources: Array<Resource>,
  inputResources: Array<Resource>,
  resourceSparingCount: number
): {
  isEnoughToProduce: boolean;
  isExactToProduce: boolean;
  requiredExtraResources: Array<Resource>;
} {
  const requiredExtraResources = difference(requiredResources, inputResources);
  const requiredExtraResourcesCount =
    requiredExtraResources.length - resourceSparingCount;
  return {
    isEnoughToProduce: requiredExtraResourcesCount <= 0,
    isExactToProduce:
      requiredResources.length -
        inputResources.length -
        resourceSparingCount ===
      0,
    requiredExtraResources,
  };
}

export async function fallbackProduction(
  requiredExtraResources: Array<Resource>,
  cardsInHand: Array<Card>,
  marketResources: Array<Resource>,
  assignedEmployee: AssignedEmployee
): Promise<{
  fallbackSuccess: boolean;
  cardIndexesToDelete: Array<number>;
}> {
  // Filter down cards in hand to the required cards
  const resourcesInHand = cardsInHand.map((card) => card.resource);
  const intersectingCardsInHand = intersection(
    resourcesInHand,
    requiredExtraResources
  );

  // Check there are enough cards including the hand of the player
  const {
    isEnoughToProduce: isEnoughToProduceIncludingHand,
  } = checkOutstandingResources(
    assignedEmployee.assignment.input,
    [...marketResources, ...resourcesInHand],
    assignedEmployee.mode.resourceSparingCount
  );
  if (!isEnoughToProduceIncludingHand) {
    console.log(
      "not enough cards in hand",
      intersectingCardsInHand,
      cardsInHand,
      requiredExtraResources
    );
    return { fallbackSuccess: false, cardIndexesToDelete: [] };
  }

  // Pick out which cards can be discarded
  const allRelevantCardsInHand = cardsInHand
    .map((card, originalIndex) => ({ ...card, originalIndex }))
    .filter((card) => requiredExtraResources.includes(card.resource));

  const choice = await prompts({
    type: "multiselect",
    message: `pick the card(s) to discard for their resources`,
    name: "cards",
    choices: allRelevantCardsInHand.map((card) => ({
      title: card.name,
      value: card,
    })),
  });

  if (!choice) {
    console.info("no choice made, skipping");
    return { fallbackSuccess: false, cardIndexesToDelete: [] };
  }

  // validate the choice isn't too much
  const {
    isEnoughToProduce: isEnoughToProduceIncludingDiscardSelection,
    isExactToProduce: isExactToProduceIncludingDiscardSelection,
  } = checkOutstandingResources(
    assignedEmployee.assignment.input,
    [...marketResources, ...choice.cards.map((card) => card.resource)],
    assignedEmployee.mode.resourceSparingCount
  );
  if (!isExactToProduceIncludingDiscardSelection) {
    console.error("too many cards chosen to discard");
    return { fallbackSuccess: false, cardIndexesToDelete: [] };
  }

  // validate the choice isn't too little
  if (!isEnoughToProduceIncludingDiscardSelection) {
    console.error("invalid selection - not enough chosen");
    return { fallbackSuccess: false, cardIndexesToDelete: [] };
  }

  // Remove the discarded cards from the hand
  const cardIndexesToDelete: Array<number> = choice.cards
    .map((card) => card.originalIndex)
    .sort()
    .reverse();
  return { fallbackSuccess: true, cardIndexesToDelete };
}
