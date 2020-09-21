import * as prompts from "prompts";
import {
  buildFactory,
  filterCardsToAffordable,
  verifyResources,
  removeBuildActionFromAvailableActions,
} from "./index";
import { playerActions } from "../index";
import { bakery, bakeryWithChain } from "../cards";
import { wheat, bread, coal, leather, butter } from "../../resources";

describe("filter to affordable cards", () => {
  it("should limit the options to only those affordable", () => {
    const game = {
      cardsInHand: [bakery, bakeryWithChain],
      cardsInDeck: [],
      cardsInDiscard: [],
      cardsInPlay: [],
      winner: null,
      players: [],
      availableActions: [playerActions.buildFactory, playerActions.endStep],
      employees: [],
      assignedEmployees: [],
      resources: [coal, coal, bread, coal],
      marketResources: [],
    };
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
      marketResources: [],
    };

    expect(() => removeBuildActionFromAvailableActions(game)).toThrow();
  });
});

describe("build factory", () => {
  it("should put a card from hand into play if can afford it", async () => {
    const game = {
      cardsInHand: [bakery],
      cardsInDeck: [],
      cardsInDiscard: [],
      cardsInPlay: [],
      winner: null,
      players: [],
      availableActions: [playerActions.buildFactory, playerActions.endStep],
      employees: [],
      assignedEmployees: [],
      resources: [coal, coal, bread, coal],
      marketResources: [],
    };
    prompts.inject([bakery, [coal, bread]]);
    await buildFactory(game);
    expect(game.cardsInPlay).toEqual([bakery]);
    expect(game.cardsInHand).toEqual([]);
    expect(game.resources).toEqual([coal, coal]);
    expect(game.availableActions).toEqual([playerActions.endStep]);
  });
  it("should allow picking all of one resource", async () => {
    const game = {
      cardsInHand: [bakery],
      cardsInDeck: [],
      cardsInDiscard: [],
      cardsInPlay: [],
      winner: null,
      players: [],
      availableActions: [playerActions.buildFactory, playerActions.endStep],
      employees: [],
      assignedEmployees: [],
      resources: [coal, coal, bread, coal],
      marketResources: [],
    };
    prompts.inject([bakery, [coal, coal]]);
    await buildFactory(game);
    expect(game.cardsInPlay).toEqual([bakery]);
  });
  it("should allow picking a variety of resources", async () => {
    const game = {
      cardsInHand: [bakery],
      cardsInDeck: [],
      cardsInDiscard: [],
      cardsInPlay: [],
      winner: null,
      players: [],
      availableActions: [playerActions.buildFactory, playerActions.endStep],
      employees: [],
      assignedEmployees: [],
      resources: [coal, coal, bread, coal],
      marketResources: [],
    };
    prompts.inject([bakery, [coal, bread]]);
    await buildFactory(game);
    expect(game.cardsInPlay).toEqual([bakery]);
  });

  xit("should re-ask if failing validation", async () => {}); // not implemented yet
  xit("should do nothing if action was aborted", async () => {}); // not implemented
  it("should remove the action if there is no building to choose", async () => {
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
      marketResources: [],
    };
    await buildFactory(game);
    expect(game.availableActions).toEqual([playerActions.endStep]);
  });
  it("should remove all actions except endStep if it completed", async () => {
    const game = {
      cardsInHand: [bakery],
      cardsInDeck: [],
      cardsInDiscard: [],
      cardsInPlay: [],
      winner: null,
      players: [],
      availableActions: [
        playerActions.buildFactory,
        playerActions.hireWorker,
        playerActions.endStep,
      ],
      employees: [],
      assignedEmployees: [],
      resources: [coal, coal, bread, coal],
      marketResources: [],
    };
    prompts.inject([bakery, [coal, bread]]);
    await buildFactory(game);
    expect(game.availableActions).toEqual([playerActions.endStep]);
  });
  xit("should discard picked resources", async () => {}); // Resources are distinct from cards currently and can't be discarded/reserved yet.
});
