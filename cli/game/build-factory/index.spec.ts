const mockActions = {
  filterCardsToAffordable: jest.fn(),
  verifyResources: jest.fn(),
  removeBuildActionFromAvailableActions: jest.fn(),
};
const mockServerActions = {
  playCard: jest.fn(),
};
jest.doMock("./build-factory-utils", () => mockActions);
jest.doMock("../../local-server", () => mockServerActions);

import * as prompts from "prompts";
import { buildFactory } from "./index";
import { playerActions } from "../index";
import { bakery } from "../cards";
import { bread, coal } from "../../resources";

beforeEach(() => {
  Object.values(mockActions).forEach((mock) => mock.mockClear());
  Object.values(mockServerActions).forEach((mock) => mock.mockClear());
});

describe("build factory", () => {
  // Bit more of an integration test.
  it("should put a card from hand into play if can afford it", async () => {
    // Arrange
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
    mockActions.verifyResources.mockReturnValue(true);
    mockActions.filterCardsToAffordable.mockReturnValue([bakery]);
    mockActions.removeBuildActionFromAvailableActions.mockImplementation(
      () => (game.availableActions = [playerActions.endStep])
    );
    mockServerActions.playCard.mockReturnValue({
      response: {
        playedCard: bakery,
        cardsInPlay: [bakery],
        cardsInHand: [],
        availableActions: [playerActions.endStep],
        resources: [coal, coal],
      },
    });

    // Act
    await buildFactory(game);

    // Assert
    expect(game.cardsInPlay).toEqual([bakery]);
    expect(game.cardsInHand).toEqual([]);
    expect(game.resources).toEqual([coal, coal]);
    expect(game.availableActions).toEqual([playerActions.endStep]);
  });
  it("should allow picking all of one resource", async () => {
    // Arrange
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
    mockActions.verifyResources.mockReturnValue(true);
    mockActions.filterCardsToAffordable.mockReturnValue([bakery]);
    mockActions.removeBuildActionFromAvailableActions.mockImplementation(
      () => (game.availableActions = [playerActions.endStep])
    );
    mockServerActions.playCard.mockReturnValue({
      response: {
        playedCard: bakery,
        cardsInPlay: [bakery],
        cardsInHand: [],
        availableActions: [playerActions.endStep],
        resources: [bread, coal],
      },
    });

    // Act
    await buildFactory(game);

    // Assert
    expect(game.cardsInPlay).toEqual([bakery]);
  });
  it("should allow picking a variety of resources", async () => {
    // Arrange
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
    mockActions.verifyResources.mockReturnValue(true);
    mockActions.filterCardsToAffordable.mockReturnValue([bakery]);
    mockActions.removeBuildActionFromAvailableActions.mockImplementation(
      () => (game.availableActions = [playerActions.endStep])
    );
    mockServerActions.playCard.mockReturnValue({
      response: {
        playedCard: bakery,
        cardsInPlay: [bakery],
        cardsInHand: [],
        availableActions: [playerActions.endStep],
        resources: [coal, coal],
      },
    });

    // Act
    await buildFactory(game);

    // Assert
    expect(game.cardsInPlay).toEqual([bakery]);
  });

  xit("should re-ask if failing validation", async () => {}); // not implemented yet
  xit("should do nothing if action was aborted", async () => {}); // not implemented
  it("should remove the action if there is no building to choose", async () => {
    // Arrange
    const game = {
      cardsInHand: [],
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
      resources: [],
      marketResources: [],
    };
    mockActions.filterCardsToAffordable.mockReturnValue([]);
    mockActions.removeBuildActionFromAvailableActions.mockImplementation(
      () =>
        (game.availableActions = [
          playerActions.hireWorker,
          playerActions.endStep,
        ])
    );
    mockServerActions.playCard.mockReturnValue({
      response: {
        playedCard: bakery,
        cardsInPlay: [bakery],
        cardsInHand: [],
        availableActions: [playerActions.endStep],
        resources: [coal, coal],
      },
    });

    // Act
    await buildFactory(game);

    // Assert
    expect(game.availableActions).toEqual([
      playerActions.hireWorker,
      playerActions.endStep,
    ]);
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
    mockActions.verifyResources.mockReturnValue(true);
    mockActions.filterCardsToAffordable.mockReturnValue([bakery]);
    mockActions.removeBuildActionFromAvailableActions.mockImplementation(
      () => (game.availableActions = [playerActions.endStep])
    );
    mockServerActions.playCard.mockReturnValue({
      response: {
        playedCard: bakery,
        cardsInPlay: [bakery],
        cardsInHand: [],
        availableActions: [playerActions.endStep],
        resources: [coal, coal],
      },
    });

    await buildFactory(game);
    expect(game.availableActions).toEqual([playerActions.endStep]);
  });
  xit("should discard picked resources", async () => {}); // Resources are distinct from cards currently and can't be discarded/reserved yet.
});