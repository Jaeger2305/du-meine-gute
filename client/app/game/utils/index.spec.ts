import { describe, expect, it, xit } from "@jest/globals";
import {
  filterCardsToAffordable,
  verifyResources,
  removeActionFromAvailableActions,
  drawFromDeck,
  spendResources,
  differenceResources,
} from "./index";
import { bread, coal, wheat, leather, grain } from "../resources";
import { Card } from "../types";
import { PlayerActionEnum } from "../client";
import { defaultGame } from "../__mocks__/game";
import { bakery, bakeryWithChain, tannery } from "../__mocks__/card";

describe("filter to affordable cards", () => {
  it("should limit the options to only those affordable", () => {
    const affordableCards = filterCardsToAffordable(
      [bakery, bakeryWithChain],
      (card: Card) => card.cost,
      [coal, bread]
    );
    expect(affordableCards).toEqual([bakery]);
  });
  xit("should work for worker cards as well factories", () => {
    const affordableCards = filterCardsToAffordable(
      [],
      (card: Card) => card.cost,
      [coal, bread]
    );
    expect(affordableCards).toEqual([]);
  });
});

describe("verify resource choice", () => {
  it("should not give an option for resources of zero value", () => {
    const isValidSelection = verifyResources([coal, bread, wheat], 2);
    expect(isValidSelection).toBe(false);
  });
  it("should allow picking over amount", () => {
    const isValidSelection = verifyResources([leather], 2);
    expect(isValidSelection).toBe(true);
  });
  it("should allow picking exact amount", async () => {
    const isValidSelection = verifyResources([grain], 2);
    expect(isValidSelection).toBe(true);
  });
  it("should not allow an excessive pick", async () => {
    const isValidSelection = verifyResources([leather, coal], 2);
    expect(isValidSelection).toBe(false);
  });
});

describe("remove an action from available actions", () => {
  it("should remove the action from the available actions", () => {
    const player = {
      ...defaultGame.players[0],
      availableActions: [PlayerActionEnum.drawCard, PlayerActionEnum.endStep],
    };
    removeActionFromAvailableActions(player, PlayerActionEnum.drawCard);
    expect(player.availableActions).toEqual([PlayerActionEnum.endStep]);
  });
  it("should throw if there is no action found", () => {
    const player = {
      ...defaultGame.players[0],
      availableActions: [PlayerActionEnum.endStep],
    };

    expect(() =>
      removeActionFromAvailableActions(player, PlayerActionEnum.buildFactory)
    ).toThrow();
  });
});

describe("draw from deck", () => {
  it("returns no card if the deck and discard are empty", () => {
    const cardsInDeck = [];
    const cardsInDiscard = [];
    const drawnCard = drawFromDeck(cardsInDeck, cardsInDiscard);
    expect(drawnCard).toBe(null);
  });
  xit("shuffles the discard", () => {}); // Lazily, this isn't mocking lodash's shuffle.
  it("moves the discard into the deck if the deck is empty", () => {
    const cardsInDeck = [];
    const cardsInDiscard = [bakery, bakeryWithChain];
    const potentialDrawnCards = cardsInDiscard.slice();
    const drawnCard = drawFromDeck(cardsInDeck, cardsInDiscard);
    expect(potentialDrawnCards.includes(drawnCard)).toBe(true);
    expect(cardsInDeck.length).toBe(1);
    expect(cardsInDiscard.length).toBe(0);
  });
  it("draws the top card from the deck", () => {
    const cardsInDeck = [bakery, bakeryWithChain];
    const cardsInDiscard = [];
    const potentialDrawnCard = cardsInDeck[0];
    const drawnCard = drawFromDeck(cardsInDeck, cardsInDiscard);
    expect(drawnCard).toBe(potentialDrawnCard);
  });
  it("draws from the deck and doesn't affect the discard", () => {
    const cardsInDeck = [bakery, bakeryWithChain];
    const cardsInDiscard = [tannery];
    const startingDiscard = cardsInDiscard.slice();
    const drawnCard = drawFromDeck(cardsInDeck, cardsInDiscard);
    expect(drawnCard).toBeTruthy();
    expect(cardsInDeck.length).toBe(1);
    expect(cardsInDiscard).toEqual(startingDiscard);
  });
});

describe("spend resources", () => {
  it("throws if there aren't enough cards in the reserve", () => {
    const reservedCards = [bakery];
    const cardsInDiscard = [];
    const resources = [coal, bread, coal];
    const resourcePayment = [coal, coal];
    expect(() =>
      spendResources(reservedCards, cardsInDiscard, resources, resourcePayment)
    ).toThrow();

    expect(reservedCards).toEqual([bakery]);
    expect(cardsInDiscard).toEqual([]);
    expect(resources).toEqual([coal, bread, coal]);
    expect(resourcePayment).toEqual([coal, coal]);
  });
  it("throws if there aren't enough resources in the supplied resources", () => {
    const reservedCards = [bakery, tannery, bakeryWithChain];
    const cardsInDiscard = [];
    const resources = [coal, bread];
    const resourcePayment = [coal, coal];
    expect(() =>
      spendResources(reservedCards, cardsInDiscard, resources, resourcePayment)
    ).toThrow();

    expect(reservedCards).toEqual([bakery, tannery, bakeryWithChain]);
    expect(cardsInDiscard).toEqual([]);
    expect(resources).toEqual([coal, bread]);
    expect(resourcePayment).toEqual([coal, coal]);
  });
  it("moves cards into the discard", () => {
    const reservedCards = [bakery, tannery, bakeryWithChain];
    const cardsInDiscard = [];
    const resources = [coal, bread, coal];
    const resourcePayment = [coal, coal];
    spendResources(reservedCards, cardsInDiscard, resources, resourcePayment);
    expect(cardsInDiscard).toEqual([bakery, tannery]);
  });
  it("removes cards from the resources", () => {
    const reservedCards = [bakery, tannery, bakeryWithChain];
    const cardsInDiscard = [];
    const resources = [coal, bread, coal];
    const resourcePayment = [coal, coal];
    spendResources(reservedCards, cardsInDiscard, resources, resourcePayment);
    expect(resources).toEqual([bread]);
  });
});

describe("difference resources", () => {
  it("filters to a non-unique list", () => {
    const originalResources = [bread, coal, coal, wheat, grain];
    const resourcesToRemove = [coal, wheat];
    const result = differenceResources(originalResources, resourcesToRemove);
    expect(result).toEqual([bread, coal, grain]);
  });
  it("does nothing to the original array, despite filtering", () => {
    const originalResources = [bread, coal, coal, wheat, grain];
    const resourcesToRemove = [coal, wheat];
    differenceResources(originalResources, resourcesToRemove);
    expect(originalResources).toEqual([bread, coal, coal, wheat, grain]);
    expect(resourcesToRemove).toEqual([coal, wheat]);
  });
  it("outputs no difference to the original array when nothing to remove", () => {
    const originalResources = [bread, coal, coal, wheat, grain];
    const resourcesToRemove = [];
    const result = differenceResources(originalResources, resourcesToRemove);
    expect(result).toEqual(originalResources);
  });
  it("outputs nothing when no original input supplied", () => {
    const originalResources = [];
    const resourcesToRemove = [coal, wheat];
    const result = differenceResources(originalResources, resourcesToRemove);
    expect(result).toEqual([]);
  });
  it("outputs nothing when no original input supplied and nothing to remove", () => {
    const originalResources = [];
    const resourcesToRemove = [];
    const result = differenceResources(originalResources, resourcesToRemove);
    expect(result).toEqual([]);
  });
  it("outputs nothing when no overlap with resources", () => {
    const originalResources = [bread, coal, coal, wheat, grain];
    const resourcesToRemove = [leather, leather];
    const result = differenceResources(originalResources, resourcesToRemove);
    expect(result).toEqual(originalResources);
  });
});
