const mockActions = {
  checkOutstandingResources: jest.fn(),
  fallbackProduction: jest.fn().mockResolvedValue({}),
};
const mockServerActions = {
  produceGood: jest.fn(),
};
jest.doMock("./production-utils", () => mockActions);
jest.doMock("../../local-server", () => mockServerActions);
import * as prompts from "prompts";
import { wood, wheat, bread, butter, coal } from "../../resources";
import { playerActions } from "../index";
import { altBakery, bakery, sawmill } from "../cards";
import { produceAtFactory } from "./index";
import { defaultGame } from "../../__mocks__/game";
import {
  defaultAssignedEmployee,
  defaultChainedAssignedEmployee,
  defaultSecondaryChainedAssignedEmployee,
  discountedAssignedEmployee,
  discountedChainedAssignedEmployee,
} from "../../__mocks__/employee";

beforeEach(() => {
  Object.values(mockActions).forEach((mock) => mock.mockClear());
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
      marketCards: [sawmill, altBakery],
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
        cardsInDiscard: [],
        cardsInDeck: [],
        resources: [bread],
      },
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
      marketCards: [sawmill],
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
    await produceAtFactory(game, player);
    expect(player.resources).toEqual([bread]);
  });
  it("should produce a resource when the user is prompted for discard", async () => {
    const player = {
      ...defaultGame.players[0],
      availableActions: [playerActions.produceAtFactory],
      assignedEmployees: [defaultAssignedEmployee],
      cardsInHand: [bakery],
    };
    const game = {
      ...defaultGame,
      marketCards: [sawmill],
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
        cardsInDiscard: [bakery],
        cardsInDeck: [],
        resources: [bread],
      },
    });
    await produceAtFactory(game, player);
    expect(player.resources).toEqual([bread]);
    expect(player.cardsInHand).toEqual([]);
    expect(game.cardsInDiscard).toEqual([bakery]);
  });
  it("should produce several resources if can chain production, relying only on the market", async () => {
    const player = {
      ...defaultGame.players[0],
      availableActions: [playerActions.produceAtFactory],
      assignedEmployees: [defaultChainedAssignedEmployee],
      cardsInHand: [bakery],
    };
    const game = {
      ...defaultGame,
      marketCards: [sawmill, altBakery, altBakery, altBakery],
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
        cardsInDiscard: [],
        cardsInDeck: [],
        resources: [bread, bread, bread],
      },
    });
    await produceAtFactory(game, player);
    expect(player.resources).toEqual([bread, bread, bread]);
  });
  it("produces extra with an efficient worker, relying only on the market", async () => {
    const player = {
      ...defaultGame.players[0],
      availableActions: [playerActions.produceAtFactory],
      assignedEmployees: [discountedChainedAssignedEmployee],
      cardsInHand: [bakery],
    };
    const game = {
      ...defaultGame,
      marketCards: [sawmill, altBakery, altBakery, altBakery],
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
        cardsInDiscard: [],
        cardsInDeck: [],
        resources: [bread, bread, bread, bread, bread],
      },
    });
    await produceAtFactory(game, player);
    expect(player.resources).toEqual([bread, bread, bread, bread, bread]);
  });
  it("should produce several resources if can chain production, allowing player discard", async () => {
    const player = {
      ...defaultGame.players[0],
      availableActions: [playerActions.produceAtFactory],
      assignedEmployees: [defaultChainedAssignedEmployee],
      cardsInHand: [bakery],
    };
    const game = {
      ...defaultGame,
      marketCards: [sawmill, altBakery],
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
        cardsInDiscard: [bakery],
        cardsInDeck: [],
        resources: [bread, bread],
      },
    });
    await produceAtFactory(game, player);
    expect(player.resources).toEqual([bread, bread]);
  });
  it("should produce multiple resources if chaining production that requires multiple secondary input", async () => {
    const player = {
      ...defaultGame.players[0],
      availableActions: [playerActions.produceAtFactory],
      assignedEmployees: [defaultSecondaryChainedAssignedEmployee],
      resources: [butter, coal],
    };
    const game = {
      ...defaultGame,
      marketCards: [sawmill, altBakery],
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
        requiredExtraResources: [butter, coal],
      })
      .mockReturnValueOnce({
        isEnoughToProduce: false,
        isExactToProduce: false,
        requiredExtraResources: [butter, coal],
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
        cardsInDiscard: [bakery],
        cardsInDeck: [],
        resources: [bread, bread, bread],
      },
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
      marketCards: [sawmill, altBakery],
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
        cardsInDiscard: [],
        cardsInDeck: [],
        resources: [bread],
      },
    });
    await produceAtFactory(game, player);
    expect(player.resources).toEqual([bread]);
  });
});
