import { difference, differenceBy, intersection } from "lodash";
import * as prompts from "prompts";
import { placeholder } from "../../resources";
import { Resource, Card, AssignedEmployee, ResourceType } from "../../types";

export function checkOutstandingResources(
  requiredResources: Array<Resource>,
  inputResources: Array<Resource>,
  resourceSparingCount: number
): {
  isEnoughToProduce: boolean;
  isExactToProduce: boolean;
  requiredExtraResources: Array<Resource>;
} {
  // Check the secondary resources are sufficient
  const inputSecondaryResources = inputResources.filter(
    (resource) => !resource.baseResource
  );
  const requiredSecondaryResources = requiredResources.filter(
    (resource) => !resource.baseResource
  );
  const extraRequiredSecondaryResources = differenceBy(
    requiredSecondaryResources,
    inputSecondaryResources,
    "type"
  );

  // Check the known base resources are sufficient
  const inputKnownBaseResources = inputResources.filter(
    (resource) =>
      resource.baseResource && resource.type !== ResourceType.placeholder
  );
  const requiredKnownBaseResources = requiredResources.filter(
    (resource) =>
      resource.baseResource && resource.type !== ResourceType.placeholder
  );
  const extraRequiredKnownBaseResources = differenceBy(
    requiredKnownBaseResources,
    inputKnownBaseResources,
    "type"
  );

  // Check capacity for placeholders
  // const inputPlaceholders = new Array(resourceSparingCount).fill(placeholder)
  const requiredPlaceholders = requiredResources.filter(
    (resource) =>
      resource.baseResource && resource.type === ResourceType.placeholder
  );

  // if extra inputKnownBaseResources are left over, they can fill the place holder requirement
  const extraInputUnknownBaseResources = differenceBy(
    inputKnownBaseResources,
    requiredKnownBaseResources,
    "type"
  );
  const extraRequiredUnknownBaseResources = new Array(
    Math.max(
      0,
      requiredPlaceholders.length - extraInputUnknownBaseResources.length
    )
  ).fill(placeholder);

  // Apply the resource sparing count to just the base resources, favouring the known resources for discount.
  const extraRequiredBaseResources = [
    ...extraRequiredUnknownBaseResources,
    ...extraRequiredKnownBaseResources,
  ];
  const requiredExtraResources = [
    ...extraRequiredSecondaryResources,
    ...extraRequiredBaseResources,
  ];
  const discountAppliedRequiredExtraResources = [
    ...extraRequiredSecondaryResources,
    ...extraRequiredBaseResources.slice(
      0,
      resourceSparingCount
        ? -resourceSparingCount
        : extraRequiredBaseResources.length
    ),
  ];

  const exactSecondaryResources =
    extraRequiredSecondaryResources.length === 0 &&
    inputSecondaryResources.length === requiredSecondaryResources.length;
  const exactBaseResources =
    discountAppliedRequiredExtraResources.length ===
    inputKnownBaseResources.length -
      requiredKnownBaseResources.length -
      requiredPlaceholders.length +
      resourceSparingCount;
  const isExactToProduce = exactSecondaryResources && exactBaseResources;

  return {
    isEnoughToProduce: !discountAppliedRequiredExtraResources.length,
    isExactToProduce,
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
    assignedEmployee.assignment.productionConfig.input,
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
    assignedEmployee.assignment.productionConfig.input,
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
