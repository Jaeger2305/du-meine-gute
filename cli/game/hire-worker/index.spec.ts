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
import { bakery, apprentice, sawmill } from "../cards";
import { bread, coal } from "../../resources";
import { defaultGame } from "../../__mocks__/game";

beforeEach(() => {
  Object.values(mockActions).forEach((mock) => mock.mockClear());
  Object.values(mockServerActions).forEach((mock) => mock.mockClear());
});

describe("hire worker", () => {
  it("should put a card from workers for hire into unassigned workers if can afford it", async () => {
    // Arrange
    const player = {
      ...defaultGame.players[0],
      cardsInPlay: [sawmill],
      availableActions: [playerActions.hireWorker, playerActions.endStep],
      resources: [coal, coal, bread, coal],
    };
    const game = {
      ...defaultGame,
      players: [player],
      availableEmployees: [apprentice],
    };
    prompts.inject([apprentice, [coal, bread]]);
    mockActions.verifyResources.mockReturnValue(true);
    mockActions.filterCardsToAffordable.mockReturnValue([apprentice]);
    mockActions.removeActionFromAvailableActions.mockImplementation(
      () => (player.availableActions = [playerActions.endStep])
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
    await hireWorker(game, player);

    // Assert
    expect(player.employees).toEqual([apprentice]);
    expect(player.resources).toEqual([coal, coal]);
    expect(player.availableActions).toEqual([playerActions.endStep]);
  });
  it("should allow picking all of one resource", async () => {
    // Arrange
    const player = {
      ...defaultGame.players[0],
      cardsInPlay: [sawmill],
      availableActions: [playerActions.hireWorker, playerActions.endStep],
      resources: [coal, coal, bread, coal],
    };
    const game = {
      ...defaultGame,
      players: [player],
      availableEmployees: [apprentice],
    };
    prompts.inject([apprentice, [coal, coal, coal]]);
    mockActions.verifyResources.mockReturnValue(true);
    mockActions.filterCardsToAffordable.mockReturnValue([apprentice]);
    mockActions.removeActionFromAvailableActions.mockImplementation(
      () => (player.availableActions = [playerActions.endStep])
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
    await hireWorker(game, player);

    // Assert
    expect(player.employees).toEqual([apprentice]);
  });
  it("should allow picking a variety of resources", async () => {
    // Arrange
    const player = {
      ...defaultGame.players[0],
      cardsInPlay: [sawmill],
      availableActions: [playerActions.hireWorker, playerActions.endStep],
      resources: [coal, coal, bread, coal],
    };
    const game = {
      ...defaultGame,
      players: [player],
      availableEmployees: [apprentice],
    };
    prompts.inject([apprentice, [coal, bread, bread]]);
    mockActions.verifyResources.mockReturnValue(true);
    mockActions.filterCardsToAffordable.mockReturnValue([apprentice]);
    mockActions.removeActionFromAvailableActions.mockImplementation(
      () => (player.availableActions = [playerActions.endStep])
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
    await hireWorker(game, player);

    // Assert
    expect(player.employees).toEqual([apprentice]);
  });

  it("should remove the action if there is no worker to choose", async () => {
    // Arrange
    const player = {
      ...defaultGame.players[0],
      cardsInPlay: [sawmill],
      availableActions: [
        playerActions.buildFactory,
        playerActions.hireWorker,
        playerActions.endStep,
      ],
      resources: [coal, coal, bread, coal],
    };
    const game = {
      ...defaultGame,
      players: [player],
      availableEmployees: [apprentice],
    };
    mockActions.filterCardsToAffordable.mockReturnValue([]);
    mockActions.removeActionFromAvailableActions.mockImplementation(
      () =>
        (player.availableActions = [
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
    await hireWorker(game, player);

    // Assert
    expect(player.availableActions).toEqual([
      playerActions.buildFactory,
      playerActions.endStep,
    ]);
  });
  xit("should remove the action if there is already a worker chosen", () => {});
  it("should remove all actions except endStep if it completed", async () => {
    // Arrange
    const player = {
      ...defaultGame.players[0],
      cardsInPlay: [sawmill],
      availableActions: [
        playerActions.buildFactory,
        playerActions.hireWorker,
        playerActions.endStep,
      ],
      resources: [coal, coal, bread, coal],
    };
    const game = {
      ...defaultGame,
      players: [player],
      availableEmployees: [apprentice],
    };
    prompts.inject([apprentice, [coal, bread, bread]]);
    mockActions.verifyResources.mockReturnValue(true);
    mockActions.filterCardsToAffordable.mockReturnValue([apprentice]);
    mockActions.removeActionFromAvailableActions.mockImplementation(
      () => (player.availableActions = [playerActions.endStep])
    );
    mockServerActions.hireWorker.mockReturnValue({
      response: {
        employees: [apprentice],
        availableEmployees: [],
        availableActions: [playerActions.endStep],
        resources: [coal, coal],
      },
    });

    await hireWorker(game, player);
    expect(player.availableActions).toEqual([playerActions.endStep]);
  });
  it("should have no options when the resource speciality prerequisite isn't met", async () => {
    const player = {
      ...defaultGame.players[0],
      cardsInPlay: [bakery],
      availableActions: [
        playerActions.buildFactory,
        playerActions.hireWorker,
        playerActions.endStep,
      ],
      resources: [coal, coal, bread, coal],
    };
    const game = {
      ...defaultGame,
      players: [player],
      availableEmployees: [apprentice],
    };
    mockActions.filterCardsToAffordable.mockReturnValue([apprentice]);
    mockActions.removeActionFromAvailableActions.mockImplementation(
      () => (player.availableActions = [playerActions.endStep])
    );

    await hireWorker(game, player);
    expect(player.employees).toEqual([]);
  });
});
