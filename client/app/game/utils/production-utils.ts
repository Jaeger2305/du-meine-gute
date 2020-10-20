import { placeholder } from "../resources";
import { GameState, PlayerState } from "../types";

import { Resource, ResourceType } from "../resources";
import { differenceResources, drawFromDeck, obfuscateDeck } from ".";

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
  const extraRequiredSecondaryResources = differenceResources(
    requiredSecondaryResources,
    inputSecondaryResources
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
  const extraRequiredKnownBaseResources = differenceResources(
    requiredKnownBaseResources,
    inputKnownBaseResources
  );

  // Check capacity for placeholders
  // const inputPlaceholders = new Array(resourceSparingCount).fill(placeholder)
  const requiredPlaceholders = requiredResources.filter(
    (resource) =>
      resource.baseResource && resource.type === ResourceType.placeholder
  );

  // if extra inputKnownBaseResources are left over, they can fill the place holder requirement
  const extraInputUnknownBaseResources = differenceResources(
    inputKnownBaseResources,
    requiredKnownBaseResources
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

export function produceGood(
  { cardsInDeck, cardsInDiscard, reservedCards }: GameState,
  { resources }: PlayerState,
  resource: Resource,
  isObfuscated: boolean = true
): void {
  // If there are no cards to draw from, shuffle the discard.
  if (!cardsInDeck.length) {
    const recycledCards = cardsInDiscard.splice(0, cardsInDiscard.length);
    cardsInDeck.push(
      ...(isObfuscated ? obfuscateDeck(recycledCards) : recycledCards)
    );
  }

  // Draw the card into the reserved card space
  const drawnCard = drawFromDeck(cardsInDeck, cardsInDiscard);
  if (drawnCard) {
    reservedCards.push(drawnCard);
    resources.push(resource);
  }
}
