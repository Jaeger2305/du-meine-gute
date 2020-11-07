const mockActions = {
  filterCardsToAffordable: jest.fn(),
  verifyResources: jest.fn(),
  removeActionFromAvailableActions: jest.fn(),
};
const mockServerActions = {
  buildFactory: jest.fn(),
};
const mockUtils = {
  payForFactory: jest.fn(),
};
jest.doMock("../utils", () => mockActions);
jest.doMock(
  "../../local-server/actions/build-factory",
  () => mockServerActions
);
jest.doMock("./build-factory-utils", () => mockUtils);

import * as prompts from "prompts";
import { buildFactory } from "./index";
import { playerActions } from "../index";
import { cardRecords } from "../cards";
import { bread, coal } from "../../resources";
import { defaultGame } from "../../__mocks__/game";

beforeEach(() => {
  Object.values(mockActions).forEach((mock) => mock.mockClear());
  Object.values(mockServerActions).forEach((mock) => mock.mockClear());
  Object.values(mockUtils).forEach((mock) => mock.mockClear());
});

describe("build factory", () => {
  // Bit more of an integration test.
  it("should put a card from reserved into play if can afford it", async () => {
    // Arrange
    const player = {
      ...defaultGame.players[0],
      availableActions: [playerActions.buildFactory, playerActions.endStep],
      resources: [coal, coal, bread, coal],
      reservedFactory: cardRecords.BAKERY_CLAY,
    };
    const game = {
      ...defaultGame,
      cardsInDeck: [cardRecords.TANNERY_METAL_WOOD],
      players: [player],
    };
    prompts.inject([cardRecords.BAKERY_CLAY, [coal, bread]]);
    mockActions.verifyResources.mockReturnValue(true);
    mockActions.filterCardsToAffordable.mockReturnValue([
      cardRecords.BAKERY_CLAY,
    ]);
    mockActions.removeActionFromAvailableActions.mockImplementation(
      () => (player.availableActions = [playerActions.endStep])
    );
    mockServerActions.buildFactory.mockReturnValue({
      response: {
        isOK: true,
      },
    });
    mockUtils.payForFactory.mockImplementation(() => {
      player.cardsInPlay = [cardRecords.BAKERY_CLAY];
      player.reservedFactory = null;
      player.availableActions = [playerActions.endStep];
      player.resources = [coal, coal];
    });

    // Act
    await buildFactory(game, player);

    // Assert
    expect(player.cardsInPlay).toEqual([cardRecords.BAKERY_CLAY]);
    expect(player.reservedFactory).toEqual(null);
    expect(player.resources).toEqual([coal, coal]);
    expect(player.availableActions).toEqual([playerActions.endStep]);
  });
  it("should allow picking all of one resource", async () => {
    // Arrange
    const player = {
      ...defaultGame.players[0],
      availableActions: [playerActions.buildFactory, playerActions.endStep],
      resources: [coal, coal, bread, coal],
      reservedFactory: cardRecords.BAKERY_CLAY,
    };
    const game = {
      ...defaultGame,
      cardsInDeck: [cardRecords.TANNERY_METAL_WOOD],
      players: [player],
    };
    prompts.inject([cardRecords.BAKERY_CLAY, [coal, coal]]);
    mockActions.verifyResources.mockReturnValue(true);
    mockActions.filterCardsToAffordable.mockReturnValue([
      cardRecords.BAKERY_CLAY,
    ]);
    mockActions.removeActionFromAvailableActions.mockImplementation(
      () => (player.availableActions = [playerActions.endStep])
    );
    mockServerActions.buildFactory.mockReturnValue({
      response: {
        isOK: true,
      },
    });
    mockUtils.payForFactory.mockImplementation(() => {
      player.cardsInPlay = [cardRecords.BAKERY_CLAY];
      player.reservedFactory = null;
      player.availableActions = [playerActions.endStep];
      player.resources = [bread, coal];
    });

    // Act
    await buildFactory(game, player);

    // Assert
    expect(player.cardsInPlay).toEqual([cardRecords.BAKERY_CLAY]);
  });
  it("should allow picking a variety of resources", async () => {
    // Arrange
    const player = {
      ...defaultGame.players[0],
      availableActions: [playerActions.buildFactory, playerActions.endStep],
      resources: [coal, coal, bread, coal],
      reservedFactory: cardRecords.BAKERY_CLAY,
    };
    const game = {
      ...defaultGame,
      cardsInDeck: [cardRecords.TANNERY_METAL_WOOD],
      players: [player],
    };
    prompts.inject([cardRecords.BAKERY_CLAY, [coal, bread]]);
    mockActions.verifyResources.mockReturnValue(true);
    mockActions.filterCardsToAffordable.mockReturnValue([
      cardRecords.BAKERY_CLAY,
    ]);
    mockActions.removeActionFromAvailableActions.mockImplementation(
      () => (player.availableActions = [playerActions.endStep])
    );
    mockServerActions.buildFactory.mockReturnValue({
      response: {
        isOK: true,
      },
    });
    mockUtils.payForFactory.mockImplementation(() => {
      player.cardsInPlay = [cardRecords.BAKERY_CLAY];
      player.reservedFactory = null;
      player.availableActions = [playerActions.endStep];
      player.resources = [coal, coal];
    });

    // Act
    await buildFactory(game, player);

    // Assert
    expect(player.cardsInPlay).toEqual([cardRecords.BAKERY_CLAY]);
  });

  xit("should re-ask if failing validation", async () => {}); // probably not needed, because the action won't be run and can be re-done anyway
  xit("should do nothing if action was aborted", async () => {}); // not implemented
  it("should remove the action if there is no building to choose", async () => {
    // Arrange
    const player = {
      ...defaultGame.players[0],
      availableActions: [
        playerActions.buildFactory,
        playerActions.hireWorker,
        playerActions.endStep,
      ],
      resources: [],
      reservedFactory: null,
    };
    const game = {
      ...defaultGame,
      cardsInDeck: [cardRecords.TANNERY_METAL_WOOD],
      players: [player],
    };
    mockActions.filterCardsToAffordable.mockReturnValue([]);
    mockActions.removeActionFromAvailableActions.mockImplementation(
      () =>
        (player.availableActions = [
          playerActions.hireWorker,
          playerActions.endStep,
        ])
    );
    mockServerActions.buildFactory.mockReturnValue({
      response: {
        playedCard: cardRecords.BAKERY_CLAY,
        cardsInPlay: [cardRecords.BAKERY_CLAY],
        reservedFactory: null,
        availableActions: [playerActions.endStep],
        resources: [coal, coal],
      },
    });

    // Act
    await buildFactory(game, player);

    // Assert
    expect(player.availableActions).toEqual([
      playerActions.hireWorker,
      playerActions.endStep,
    ]);
  });
  it("should remove all actions except endStep if it completed", async () => {
    const player = {
      ...defaultGame.players[0],
      availableActions: [
        playerActions.buildFactory,
        playerActions.hireWorker,
        playerActions.endStep,
      ],
      resources: [coal, coal, bread, coal],
      reservedFactory: cardRecords.BAKERY_CLAY,
    };
    const game = {
      ...defaultGame,
      cardsInDeck: [cardRecords.TANNERY_METAL_WOOD],
      players: [player],
    };
    prompts.inject([cardRecords.BAKERY_CLAY, [coal, bread]]);
    mockActions.verifyResources.mockReturnValue(true);
    mockActions.filterCardsToAffordable.mockReturnValue([
      cardRecords.BAKERY_CLAY,
    ]);
    mockActions.removeActionFromAvailableActions.mockImplementation(
      () => (player.availableActions = [playerActions.endStep])
    );
    mockServerActions.buildFactory.mockReturnValue({
      response: {
        isOK: true,
      },
    });
    mockUtils.payForFactory.mockImplementation(() => {
      player.cardsInPlay = [cardRecords.BAKERY_CLAY];
      player.reservedFactory = null;
      player.availableActions = [playerActions.endStep];
      player.resources = [coal, coal];
    });

    await buildFactory(game, player);
    expect(player.availableActions).toEqual([playerActions.endStep]);
  });
  xit("should discard picked resources", async () => {}); // Resources are distinct from cards currently and can't be discarded/reserved yet.
});
