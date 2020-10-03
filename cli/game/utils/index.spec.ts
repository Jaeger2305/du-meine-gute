import {
  filterCardsToAffordable,
  verifyResources,
  removeActionFromAvailableActions,
  spendResources,
} from "./index";
import { playerActions } from "../index";
import { bread, coal, wheat, leather, butter } from "../../resources";
import { Card, PlayerActionEnum } from "../../types";
import { defaultGame } from "../../__mocks__/game";
import { bakery, bakeryWithChain, tannery } from "../../__mocks__/card";

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
    const isValidSelection = verifyResources([butter], 2);
    expect(isValidSelection).toBe(true);
  });
  it("should not allow an excessive pick", async () => {
    const isValidSelection = verifyResources([leather, coal], 2);
    expect(isValidSelection).toBe(false);
  });
});

describe("remove build action from available actions", () => {
  it("should remove the action from the available actions", () => {
    const player = {
      ...defaultGame.players[0],
      availableActions: [playerActions.buildFactory, playerActions.endStep],
    };
    removeActionFromAvailableActions(player, PlayerActionEnum.buildFactory);
    expect(player.availableActions).toEqual([playerActions.endStep]);
  });
  it("should throw if there is no action found", () => {
    const player = {
      ...defaultGame.players[0],
      availableActions: [playerActions.endStep],
    };

    expect(() =>
      removeActionFromAvailableActions(player, PlayerActionEnum.buildFactory)
    ).toThrow();
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
