import { jest, describe, beforeEach, expect, it, xit } from "@jest/globals";
const mockActions = {
  filterCardsToAffordable: jest.fn(),
  verifyResources: jest.fn(),
  removeActionFromAvailableActions: jest.fn(),
};
const mockUtils = {
  payForFactory: jest.fn(),
};
jest.doMock("../../utils", () => mockActions);
jest.doMock("./build-factory-utils", () => mockUtils);

import { buildFactory } from "./index";
import { PlayerActionEnum, playerActions } from "../index";
import { cardRecords } from "../../cards";
import { bread, coal } from "../../resources";
import { defaultGame } from "../../__mocks__/game";

beforeEach(() => {
  Object.values(mockActions).forEach((mock) => mock.mockClear());
  Object.values(mockUtils).forEach((mock) => mock.mockClear());
});

describe("build factory", () => {
  // Bit more of an integration test.
  it("should put a card from reserved into play if can afford it", async () => {
    // Arrange
    const player = {
      ...defaultGame.players[0],
      availableActions: [PlayerActionEnum.buildFactory, PlayerActionEnum.endStep],
      resources: [coal, coal, bread, coal],
      reservedFactory: cardRecords.BAKERY_CLAY,
    };
    const game = {
      ...defaultGame,
      cardsInDeck: [cardRecords.TANNERY_METAL_WOOD],
      players: [player],
    };
    mockActions.verifyResources.mockReturnValue(true);
    mockActions.filterCardsToAffordable.mockReturnValue([
      cardRecords.BAKERY_CLAY,
    ]);
    mockActions.removeActionFromAvailableActions.mockImplementation(
      () => (player.availableActions = [PlayerActionEnum.endStep])
    );
    mockUtils.payForFactory.mockImplementation(() => {
      player.cardsInPlay = [cardRecords.BAKERY_CLAY];
      player.reservedFactory = null;
      player.availableActions = [PlayerActionEnum.endStep];
      player.resources = [coal, coal];
    });

    // Act
    await buildFactory(game, player, { resources: [coal, bread]});

    // Assert
    expect(player.cardsInPlay).toEqual([cardRecords.BAKERY_CLAY]);
    expect(player.reservedFactory).toEqual(null);
    expect(player.resources).toEqual([coal, coal]);
    expect(player.availableActions).toEqual([PlayerActionEnum.endStep]);
  });
  it("should allow picking all of one resource", async () => {
    // Arrange
    const player = {
      ...defaultGame.players[0],
      availableActions: [PlayerActionEnum.buildFactory, PlayerActionEnum.endStep],
      resources: [coal, coal, bread, coal],
      reservedFactory: cardRecords.BAKERY_CLAY,
    };
    const game = {
      ...defaultGame,
      cardsInDeck: [cardRecords.TANNERY_METAL_WOOD],
      players: [player],
    };
    mockActions.verifyResources.mockReturnValue(true);
    mockActions.filterCardsToAffordable.mockReturnValue([
      cardRecords.BAKERY_CLAY,
    ]);
    mockActions.removeActionFromAvailableActions.mockImplementation(
      () => (player.availableActions = [PlayerActionEnum.endStep])
    );
    mockUtils.payForFactory.mockImplementation(() => {
      player.cardsInPlay = [cardRecords.BAKERY_CLAY];
      player.reservedFactory = null;
      player.availableActions = [PlayerActionEnum.endStep];
      player.resources = [bread, coal];
    });

    // Act
    await buildFactory(game, player, { resources: [coal, coal]});

    // Assert
    expect(player.cardsInPlay).toEqual([cardRecords.BAKERY_CLAY]);
  });
  it("should allow picking a variety of resources", async () => {
    // Arrange
    const player = {
      ...defaultGame.players[0],
      availableActions: [PlayerActionEnum.buildFactory, PlayerActionEnum.endStep],
      resources: [coal, coal, bread, coal],
      reservedFactory: cardRecords.BAKERY_CLAY,
    };
    const game = {
      ...defaultGame,
      cardsInDeck: [cardRecords.TANNERY_METAL_WOOD],
      players: [player],
    };
    mockActions.verifyResources.mockReturnValue(true);
    mockActions.filterCardsToAffordable.mockReturnValue([
      cardRecords.BAKERY_CLAY,
    ]);
    mockActions.removeActionFromAvailableActions.mockImplementation(
      () => (player.availableActions = [PlayerActionEnum.endStep])
    );
    mockUtils.payForFactory.mockImplementation(() => {
      player.cardsInPlay = [cardRecords.BAKERY_CLAY];
      player.reservedFactory = null;
      player.availableActions = [PlayerActionEnum.endStep];
      player.resources = [coal, coal];
    });

    // Act
    await buildFactory(game, player, { resources: [coal, bread]});

    // Assert
    expect(player.cardsInPlay).toEqual([cardRecords.BAKERY_CLAY]);
  });

  xit("should re-ask if failing validation", async () => {}); // probably not needed, because the action won't be run and can be re-done anyway
  xit("should do nothing if action was aborted", async () => {}); // not implemented
  xit("should discard picked resources", async () => {}); // Resources are distinct from cards currently and can't be discarded/reserved yet.
});
