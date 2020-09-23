import {
  filterCardsToAffordable,
  verifyResources,
  removeBuildActionFromAvailableActions,
} from "./build-factory-utils";
import { playerActions } from "../index";
import { bakery, bakeryWithChain } from "../cards";
import { bread, coal, wheat, leather, butter } from "../../resources";

describe("filter to affordable cards", () => {
  it("should limit the options to only those affordable", () => {
    const affordableCards = filterCardsToAffordable(
      [bakery, bakeryWithChain],
      [coal, bread]
    );
    expect(affordableCards).toEqual([bakery]);
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
    const game = {
      cardsInHand: [],
      cardsInDeck: [],
      cardsInDiscard: [],
      cardsInPlay: [],
      winner: null,
      players: [],
      availableActions: [playerActions.buildFactory, playerActions.endStep],
      employees: [],
      assignedEmployees: [],
      resources: [],
      reservedCards: [],
      marketResources: [],
    };
    removeBuildActionFromAvailableActions(game);
    expect(game.availableActions).toEqual([playerActions.endStep]);
  });
  it("should throw if there is no action found", () => {
    const game = {
      cardsInHand: [],
      cardsInDeck: [],
      cardsInDiscard: [],
      cardsInPlay: [],
      winner: null,
      players: [],
      availableActions: [playerActions.endStep],
      employees: [],
      assignedEmployees: [],
      resources: [],
      reservedCards: [],
      marketResources: [],
    };

    expect(() => removeBuildActionFromAvailableActions(game)).toThrow();
  });
});
