const mockActions = {
  checkOutstandingResources: jest.fn(),
  fallbackProduction: jest.fn().mockResolvedValue({}),
  produceGood: jest.fn(),
};
const mockServerActions = {
  produceGood: jest.fn(),
};
jest.doMock("./production-utils", () => mockActions);
jest.doMock("../../local-server/actions/produce-good", () => mockServerActions);
import * as prompts from "prompts";
import { wheat, bread, grain, coal } from "../../resources";
import { playerActions } from "../index";
import { cardRecords } from "../cards";
import { produceAtFactory } from "./index";
import { defaultGame } from "../../__mocks__/game";
import {
  defaultAssignedEmployee,
  defaultChainedAssignedEmployee,
  defaultSecondaryChainedAssignedEmployee,
  discountedAssignedEmployee,
  discountedChainedAssignedEmployee,
} from "../../__mocks__/worker";

beforeEach(() => {
  Object.values(mockActions).forEach((mock) => mock.mockClear());
  Object.values(mockServerActions).forEach((mock) => mock.mockClear());
});

describe("produce at factory", () => {
  it("should produce a resource when everything is present in the market", async () => {
    const player = {
      ...defaultGame.players[0],
      availableActions: [playerActions.produceAtFactory],
      assignedEmployees: [defaultAssignedEmployee],
    };
    const game = {
      ...defaultGame,
      marketCards: [cardRecords.SAWMILL_CLAY_METAL, cardRecords.BAKERY_CLAY],
    };
    const factoryWorker = {
      ...player.assignedEmployees[0],
      index: 0,
    };
    prompts.inject([factoryWorker]);
    mockActions.checkOutstandingResources.mockReturnValueOnce({
      isEnoughToProduce: true,
      isExactToProduce: true,
      requiredExtraResources: [],
    });
    mockServerActions.produceGood.mockReturnValue({
      response: {
        isOK: true,
      },
    });
    mockActions.produceGood.mockImplementation(() => {
      player.resources = [bread];
      game.cardsInDeck = [];
      game.cardsInDiscard = [];
    });
    await produceAtFactory(game, player);
    expect(player.resources).toEqual([bread]);
  });
  it("should produce a resource when the discount + market is sufficient", async () => {
    const player = {
      ...defaultGame.players[0],
      availableActions: [playerActions.produceAtFactory],
      assignedEmployees: [discountedAssignedEmployee],
    };
    const game = {
      ...defaultGame,
      marketCards: [cardRecords.SAWMILL_CLAY_METAL],
    };
    const factoryWorker = {
      ...player.assignedEmployees[0],
      index: 0,
    };
    mockActions.checkOutstandingResources.mockReturnValueOnce({
      isEnoughToProduce: true,
      isExactToProduce: true,
      requiredExtraResources: [wheat],
    });
    prompts.inject([factoryWorker]);
    mockServerActions.produceGood.mockReturnValue({
      response: {
        isOK: true,
      },
    });
    mockActions.produceGood.mockImplementation(() => {
      player.resources = [bread];
      game.cardsInDeck = [];
      game.cardsInDiscard = [];
    });
    await produceAtFactory(game, player);
    expect(player.resources).toEqual([bread]);
  });
  it("should produce a resource when the user is prompted for discard", async () => {
    const player = {
      ...defaultGame.players[0],
      availableActions: [playerActions.produceAtFactory],
      assignedEmployees: [defaultAssignedEmployee],
      cardsInHand: [cardRecords.BAKERY_CLAY],
    };
    const game = {
      ...defaultGame,
      marketCards: [cardRecords.SAWMILL_CLAY_METAL],
    };
    const factoryWorker = {
      ...player.assignedEmployees[0],
      index: 0,
    };
    prompts.inject([factoryWorker]);

    mockActions.checkOutstandingResources.mockReturnValueOnce({
      isEnoughToProduce: false,
      isExactToProduce: false,
      requiredExtraResources: [wheat],
    });

    mockActions.fallbackProduction.mockResolvedValueOnce({
      fallbackSuccess: true,
      cardIndexesToDelete: [0],
    });
    mockServerActions.produceGood.mockReturnValue({
      response: {
        isOK: true,
      },
    });
    mockActions.produceGood.mockImplementation(() => {
      player.resources = [bread];
      game.cardsInDeck = [];
      game.cardsInDiscard = [cardRecords.BAKERY_CLAY];
    });
    await produceAtFactory(game, player);
    expect(player.resources).toEqual([bread]);
    expect(player.cardsInHand).toEqual([]);
    expect(game.cardsInDiscard).toEqual([cardRecords.BAKERY_CLAY]);
  });
  it("should produce several resources if can chain production, relying only on the market", async () => {
    const player = {
      ...defaultGame.players[0],
      availableActions: [playerActions.produceAtFactory],
      assignedEmployees: [defaultChainedAssignedEmployee],
      cardsInHand: [cardRecords.BAKERY_CLAY],
    };
    const game = {
      ...defaultGame,
      marketCards: [
        cardRecords.SAWMILL_CLAY_METAL,
        cardRecords.BAKERY_METAL,
        cardRecords.BAKERY_METAL,
        cardRecords.BAKERY_METAL,
      ],
    };
    // This isn't actually in the official rules! Surprisingly, players can only chain using cards from their hand.
    const factoryWorker = {
      ...player.assignedEmployees[0],
      index: 0,
    };
    prompts.inject([factoryWorker]);

    mockActions.checkOutstandingResources
      .mockReturnValueOnce({
        isEnoughToProduce: true,
        isExactToProduce: true,
        requiredExtraResources: [],
      })
      .mockReturnValueOnce({
        isEnoughToProduce: true,
        isExactToProduce: true,
        requiredExtraResources: [],
      })
      .mockReturnValueOnce({
        isEnoughToProduce: true,
        isExactToProduce: true,
        requiredExtraResources: [],
      })
      .mockReturnValueOnce({
        isEnoughToProduce: false,
        isExactToProduce: false,
        requiredExtraResources: [wheat],
      });

    mockActions.fallbackProduction.mockResolvedValueOnce({
      fallbackSuccess: false,
      cardIndexesToDelete: [],
    });
    mockServerActions.produceGood.mockReturnValue({
      response: {
        isOK: true,
      },
    });
    mockActions.produceGood.mockImplementation(() => {
      player.resources = [bread, bread, bread];
      game.cardsInDeck = [];
      game.cardsInDiscard = [];
    });
    await produceAtFactory(game, player);
    expect(player.resources).toEqual([bread, bread, bread]);
  });
  it("produces extra with an efficient worker, relying only on the market", async () => {
    const player = {
      ...defaultGame.players[0],
      availableActions: [playerActions.produceAtFactory],
      assignedEmployees: [discountedChainedAssignedEmployee],
      cardsInHand: [cardRecords.BAKERY_CLAY],
    };
    const game = {
      ...defaultGame,
      marketCards: [
        cardRecords.SAWMILL_CLAY_METAL,
        cardRecords.BAKERY_METAL,
        cardRecords.BAKERY_METAL,
        cardRecords.BAKERY_METAL,
      ],
    };
    const factoryWorker = {
      ...player.assignedEmployees[0],
      index: 0,
    };
    prompts.inject([factoryWorker]);

    mockActions.checkOutstandingResources
      .mockReturnValueOnce({
        isEnoughToProduce: true,
        isExactToProduce: true,
        requiredExtraResources: [],
      })
      .mockReturnValueOnce({
        isEnoughToProduce: true,
        isExactToProduce: true,
        requiredExtraResources: [],
      })
      .mockReturnValueOnce({
        isEnoughToProduce: true,
        isExactToProduce: true,
        requiredExtraResources: [],
      })
      .mockReturnValueOnce({
        isEnoughToProduce: true,
        isExactToProduce: true,
        requiredExtraResources: [wheat],
      })
      .mockReturnValueOnce({
        isEnoughToProduce: false,
        isExactToProduce: false,
        requiredExtraResources: [wheat],
      });

    mockActions.fallbackProduction.mockResolvedValueOnce({
      fallbackSuccess: false,
      cardIndexesToDelete: [],
    });
    mockServerActions.produceGood.mockReturnValue({
      response: {
        isOK: true,
      },
    });
    mockActions.produceGood.mockImplementation(() => {
      player.resources = [bread, bread, bread, bread, bread];
      game.cardsInDeck = [];
      game.cardsInDiscard = [];
    });
    await produceAtFactory(game, player);
    expect(player.resources).toEqual([bread, bread, bread, bread, bread]);
  });
  it("should produce several resources if can chain production, allowing player discard", async () => {
    const player = {
      ...defaultGame.players[0],
      availableActions: [playerActions.produceAtFactory],
      assignedEmployees: [defaultChainedAssignedEmployee],
      cardsInHand: [cardRecords.BAKERY_CLAY],
    };
    const game = {
      ...defaultGame,
      marketCards: [cardRecords.SAWMILL_CLAY_METAL, cardRecords.BAKERY_METAL],
    };
    const factoryWorker = {
      ...player.assignedEmployees[0],
      index: 0,
    };
    prompts.inject([factoryWorker]);

    mockActions.checkOutstandingResources
      .mockReturnValueOnce({
        isEnoughToProduce: true,
        isExactToProduce: true,
        requiredExtraResources: [],
      })
      .mockReturnValueOnce({
        isEnoughToProduce: false,
        isExactToProduce: false,
        requiredExtraResources: [wheat],
      })
      .mockReturnValueOnce({
        isEnoughToProduce: false,
        isExactToProduce: false,
        requiredExtraResources: [wheat],
      });

    mockActions.fallbackProduction
      .mockResolvedValueOnce({
        fallbackSuccess: true,
        cardIndexesToDelete: [0],
      })
      .mockResolvedValueOnce({
        fallbackSuccess: false,
        cardIndexesToDelete: [],
      });

    mockServerActions.produceGood.mockReturnValue({
      response: {
        isOK: true,
      },
    });
    mockActions.produceGood.mockImplementation(() => {
      player.resources = [bread, bread];
      game.cardsInDeck = [];
      game.cardsInDiscard = [cardRecords.BAKERY_CLAY];
    });

    await produceAtFactory(game, player);
    expect(player.resources).toEqual([bread, bread]);
  });
  it("should produce multiple resources if chaining production that requires multiple secondary input", async () => {
    const player = {
      ...defaultGame.players[0],
      availableActions: [playerActions.produceAtFactory],
      assignedEmployees: [defaultSecondaryChainedAssignedEmployee],
      resources: [grain, coal],
    };
    const game = {
      ...defaultGame,
      marketCards: [cardRecords.SAWMILL_CLAY_METAL, cardRecords.BAKERY_METAL],
    };
    const factoryWorker = {
      ...player.assignedEmployees[0],
      index: 0,
    };
    prompts.inject([factoryWorker]);

    mockActions.checkOutstandingResources
      .mockReturnValueOnce({
        isEnoughToProduce: true,
        isExactToProduce: true,
        requiredExtraResources: [],
      })
      .mockReturnValueOnce({
        isEnoughToProduce: false,
        isExactToProduce: false,
        requiredExtraResources: [grain, coal],
      })
      .mockReturnValueOnce({
        isEnoughToProduce: false,
        isExactToProduce: false,
        requiredExtraResources: [grain, coal],
      });

    mockActions.fallbackProduction
      .mockResolvedValueOnce({
        fallbackSuccess: true,
        cardIndexesToDelete: [0],
      })
      .mockResolvedValueOnce({
        fallbackSuccess: false,
        cardIndexesToDelete: [],
      });

    mockServerActions.produceGood.mockReturnValue({
      response: {
        isOK: true,
      },
    });
    mockActions.produceGood.mockImplementation(() => {
      player.resources = [bread, bread, bread];
      game.cardsInDeck = [];
      game.cardsInDiscard = [cardRecords.BAKERY_CLAY];
    });
    await produceAtFactory(game, player);
    expect(player.resources).toEqual([bread, bread, bread]);
  });
  it("should not produce if the market contains chainable input but the hand doesn't", async () => {
    const player = {
      ...defaultGame.players[0],
      availableActions: [playerActions.produceAtFactory],
      assignedEmployees: [defaultChainedAssignedEmployee],
    };
    const game = {
      ...defaultGame,
      marketCards: [cardRecords.SAWMILL_CLAY_METAL, cardRecords.BAKERY_METAL],
    };
    const factoryWorker = {
      ...player.assignedEmployees[0],
      index: 0,
    };
    prompts.inject([factoryWorker]);

    mockActions.checkOutstandingResources
      .mockReturnValueOnce({
        isEnoughToProduce: true,
        isExactToProduce: true,
        requiredExtraResources: [],
      })
      .mockReturnValueOnce({
        isEnoughToProduce: false,
        isExactToProduce: false,
        requiredExtraResources: [wheat],
      });

    mockActions.fallbackProduction.mockResolvedValueOnce({
      fallbackSuccess: false,
      cardIndexesToDelete: [],
    });

    mockServerActions.produceGood.mockReturnValue({
      response: {
        isOK: true,
      },
    });
    mockActions.produceGood.mockImplementation(() => {
      player.resources = [bread];
      game.cardsInDeck = [];
      game.cardsInDiscard = [];
    });
    await produceAtFactory(game, player);
    expect(player.resources).toEqual([bread]);
  });
});
