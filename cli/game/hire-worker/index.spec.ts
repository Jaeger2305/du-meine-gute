const mockActions = {
  filterCardsToAffordable: jest.fn(),
  verifyResources: jest.fn(),
  removeActionFromAvailableActions: jest.fn(),
};
const mockServerActions = {
  hireWorker: jest.fn(),
};
jest.doMock("../utils", () => mockActions);
jest.doMock("../../local-server", () => mockServerActions);

import * as prompts from "prompts";
import { hireWorker } from "./index";
import { playerActions } from "../index";
import { bakery, apprentice } from "../cards";
import { bread, coal } from "../../resources";

beforeEach(() => {
  Object.values(mockActions).forEach((mock) => mock.mockClear());
  Object.values(mockServerActions).forEach((mock) => mock.mockClear());
});

describe("hire worker", () => {
  it("should put a card from workers for hire into unassigned workers if can afford it", async () => {
    // Arrange
    const game = {
      cardsInHand: [],
      cardsInDeck: [],
      cardsInDiscard: [],
      cardsInPlay: [bakery],
      winner: null,
      players: [],
      availableActions: [playerActions.hireWorker, playerActions.endStep],
      availableEmployees: [apprentice],
      employees: [],
      assignedEmployees: [],
      resources: [coal, coal, bread, coal],
      reservedCards: [],
      reservedFactory: null,
      marketCards: [],
      score: 0,
    };
    prompts.inject([apprentice, [coal, bread]]);
    mockActions.verifyResources.mockReturnValue(true);
    mockActions.filterCardsToAffordable.mockReturnValue([apprentice]);
    mockActions.removeActionFromAvailableActions.mockImplementation(
      () => (game.availableActions = [playerActions.endStep])
    );
    mockServerActions.hireWorker.mockReturnValue({
      response: {
        employees: [apprentice],
        availableEmployees: [],
        availableActions: [playerActions.endStep],
        resources: [coal, coal],
      },
    });

    // Act
    await hireWorker(game);

    // Assert
    expect(game.employees).toEqual([apprentice]);
    expect(game.resources).toEqual([coal, coal]);
    expect(game.availableActions).toEqual([playerActions.endStep]);
  });
  it("should allow picking all of one resource", async () => {
    // Arrange
    const game = {
      cardsInHand: [],
      cardsInDeck: [],
      cardsInDiscard: [],
      cardsInPlay: [],
      winner: null,
      players: [],
      availableActions: [playerActions.hireWorker, playerActions.endStep],
      availableEmployees: [apprentice],
      employees: [],
      assignedEmployees: [],
      resources: [coal, coal, bread, coal],
      reservedCards: [],
      reservedFactory: null,
      marketCards: [],
      score: 0,
    };
    prompts.inject([apprentice, [coal, coal]]);
    mockActions.verifyResources.mockReturnValue(true);
    mockActions.filterCardsToAffordable.mockReturnValue([apprentice]);
    mockActions.removeActionFromAvailableActions.mockImplementation(
      () => (game.availableActions = [playerActions.endStep])
    );
    mockServerActions.hireWorker.mockReturnValue({
      response: {
        employees: [apprentice],
        availableEmployees: [],
        availableActions: [playerActions.endStep],
        resources: [bread, coal],
      },
    });

    // Act
    await hireWorker(game);

    // Assert
    expect(game.employees).toEqual([apprentice]);
  });
  it("should allow picking a variety of resources", async () => {
    // Arrange
    const game = {
      cardsInHand: [],
      cardsInDeck: [],
      cardsInDiscard: [],
      cardsInPlay: [],
      winner: null,
      players: [],
      availableActions: [playerActions.hireWorker, playerActions.endStep],
      availableEmployees: [apprentice],
      employees: [],
      assignedEmployees: [],
      resources: [coal, coal, bread, coal],
      reservedCards: [],
      reservedFactory: null,
      marketCards: [],
      score: 0,
    };
    prompts.inject([bakery, [coal, bread]]);
    mockActions.verifyResources.mockReturnValue(true);
    mockActions.filterCardsToAffordable.mockReturnValue([bakery]);
    mockActions.removeActionFromAvailableActions.mockImplementation(
      () => (game.availableActions = [playerActions.endStep])
    );
    mockServerActions.hireWorker.mockReturnValue({
      response: {
        employees: [apprentice],
        availableEmployees: [],
        availableActions: [playerActions.endStep],
        resources: [coal, coal],
      },
    });

    // Act
    await hireWorker(game);

    // Assert
    expect(game.employees).toEqual([apprentice]);
  });

  it("should remove the action if there is no worker to choose", async () => {
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
      availableEmployees: [apprentice],
      employees: [],
      assignedEmployees: [],
      resources: [],
      reservedCards: [],
      reservedFactory: null,
      marketCards: [],
      score: 0,
    };
    mockActions.filterCardsToAffordable.mockReturnValue([]);
    mockActions.removeActionFromAvailableActions.mockImplementation(
      () =>
        (game.availableActions = [
          playerActions.buildFactory,
          playerActions.endStep,
        ])
    );
    mockServerActions.hireWorker.mockReturnValue({
      response: {
        playedCard: null,
        employees: [],
        availableEmployees: [],
        availableActions: [playerActions.endStep],
        resources: [coal, coal],
      },
    });

    // Act
    await hireWorker(game);

    // Assert
    expect(game.availableActions).toEqual([
      playerActions.buildFactory,
      playerActions.endStep,
    ]);
  });
  xit("should remove the action if there is already a worker chosen", () => {});
  it("should remove all actions except endStep if it completed", async () => {
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
      availableEmployees: [apprentice],
      employees: [],
      assignedEmployees: [],
      resources: [coal, coal, bread, coal],
      reservedCards: [],
      reservedFactory: null,
      marketCards: [],
      score: 0,
    };
    prompts.inject([bakery, [coal, bread]]);
    mockActions.verifyResources.mockReturnValue(true);
    mockActions.filterCardsToAffordable.mockReturnValue([bakery]);
    mockActions.removeActionFromAvailableActions.mockImplementation(
      () => (game.availableActions = [playerActions.endStep])
    );
    mockServerActions.hireWorker.mockReturnValue({
      response: {
        employees: [apprentice],
        availableEmployees: [],
        availableActions: [playerActions.endStep],
        resources: [coal, coal],
      },
    });

    await hireWorker(game);
    expect(game.availableActions).toEqual([playerActions.endStep]);
  });
  xit("should filter workers according to their building requirements", () => {});
});
