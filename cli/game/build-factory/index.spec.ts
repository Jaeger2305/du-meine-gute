const mockActions = {
  filterCardsToAffordable: jest.fn(),
  verifyResources: jest.fn(),
  removeActionFromAvailableActions: jest.fn(),
};
const mockServerActions = {
  playCard: jest.fn(),
};
jest.doMock("../utils", () => mockActions);
jest.doMock("../../local-server", () => mockServerActions);

import * as prompts from "prompts";
import { buildFactory } from "./index";
import { playerActions } from "../index";
import { bakery, tannery } from "../cards";
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
      cardsInDeck: [tannery],
      cardsInDiscard: [],
      cardsInPlay: [],
      winner: null,
      players: [],
      availableActions: [playerActions.buildFactory, playerActions.endStep],
      employees: [],
      availableEmployees: [],
      assignedEmployees: [],
      resources: [coal, coal, bread, coal],
      reservedCards: [],
      marketCards: [],
      score: 0,
    };
    prompts.inject([bakery, [coal, bread]]);
    mockActions.verifyResources.mockReturnValue(true);
    mockActions.filterCardsToAffordable.mockReturnValue([bakery]);
    mockActions.removeActionFromAvailableActions.mockImplementation(
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
      cardsInDeck: [tannery],
      cardsInDiscard: [],
      cardsInPlay: [],
      winner: null,
      players: [],
      availableActions: [playerActions.buildFactory, playerActions.endStep],
      employees: [],
      availableEmployees: [],
      assignedEmployees: [],
      resources: [coal, coal, bread, coal],
      reservedCards: [],
      marketCards: [],
      score: 0,
    };
    prompts.inject([bakery, [coal, coal]]);
    mockActions.verifyResources.mockReturnValue(true);
    mockActions.filterCardsToAffordable.mockReturnValue([bakery]);
    mockActions.removeActionFromAvailableActions.mockImplementation(
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
      cardsInDeck: [tannery],
      cardsInDiscard: [],
      cardsInPlay: [],
      winner: null,
      players: [],
      availableActions: [playerActions.buildFactory, playerActions.endStep],
      employees: [],
      availableEmployees: [],
      assignedEmployees: [],
      resources: [coal, coal, bread, coal],
      reservedCards: [],
      marketCards: [],
      score: 0,
    };
    prompts.inject([bakery, [coal, bread]]);
    mockActions.verifyResources.mockReturnValue(true);
    mockActions.filterCardsToAffordable.mockReturnValue([bakery]);
    mockActions.removeActionFromAvailableActions.mockImplementation(
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

  xit("should re-ask if failing validation", async () => {}); // probably not needed, because the action won't be run and can be re-done anyway
  xit("should do nothing if action was aborted", async () => {}); // not implemented
  it("should remove the action if there is no building to choose", async () => {
    // Arrange
    const game = {
      cardsInHand: [],
      cardsInDeck: [tannery],
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
      availableEmployees: [],
      assignedEmployees: [],
      resources: [],
      reservedCards: [],
      marketCards: [],
      score: 0,
    };
    mockActions.filterCardsToAffordable.mockReturnValue([]);
    mockActions.removeActionFromAvailableActions.mockImplementation(
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
      cardsInDeck: [tannery],
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
      availableEmployees: [],
      assignedEmployees: [],
      resources: [coal, coal, bread, coal],
      reservedCards: [],
      marketCards: [],
      score: 0,
    };
    prompts.inject([bakery, [coal, bread]]);
    mockActions.verifyResources.mockReturnValue(true);
    mockActions.filterCardsToAffordable.mockReturnValue([bakery]);
    mockActions.removeActionFromAvailableActions.mockImplementation(
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
