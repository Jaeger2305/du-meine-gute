const mockActions = {
  checkOutstandingResources: jest.fn(),
  fallbackProduction: jest.fn().mockResolvedValue({}),
};
jest.doMock("./production-utils", () => mockActions);
import * as prompts from "prompts";
import { wood, wheat, bread } from "../../resources";
import { playerActions } from "../index";
import { bakery, bakeryWithChain } from "../cards";
import { produceAtFactory } from "./index";

beforeEach(() => {
  Object.values(mockActions).forEach((mock) => mock.mockClear());
});

describe("produce at factory", () => {
  it("should produce a resource when everything is present in the market", async () => {
    const game = {
      cardsInHand: [],
      cardsInDeck: [],
      cardsInDiscard: [],
      cardsInPlay: [],
      winner: null,
      players: [],
      availableActions: [playerActions.produceAtFactory],
      employees: [],
      assignedEmployees: [
        {
          name: "assigned",
          assignment: bakery,
          mode: {
            productionCount: 1,
            resourceSparingCount: 0,
          },
        },
      ],
      resources: [],
      marketResources: [wood, wheat],
    };
    const factoryWorker = {
      factoryWorker: game.assignedEmployees[0],
      index: 0,
    };
    prompts.inject([factoryWorker]);
    mockActions.checkOutstandingResources.mockReturnValueOnce({
      isEnoughToProduce: true,
      isExactToProduce: true,
      requiredExtraResources: [],
    });
    await produceAtFactory(game);
    expect(game.resources).toEqual([bread]);
  });
  it("should produce a resource when the discount + market is sufficient", async () => {
    const game = {
      cardsInHand: [],
      cardsInDeck: [],
      cardsInDiscard: [],
      cardsInPlay: [],
      winner: null,
      players: [],
      availableActions: [playerActions.produceAtFactory],
      employees: [],
      assignedEmployees: [
        {
          name: "assigned",
          assignment: bakery,
          mode: {
            productionCount: 1,
            resourceSparingCount: 1,
          },
        },
      ],
      resources: [],
      marketResources: [wood],
    };
    const factoryWorker = {
      factoryWorker: game.assignedEmployees[0],
      index: 0,
    };
    mockActions.checkOutstandingResources.mockReturnValueOnce({
      isEnoughToProduce: true,
      isExactToProduce: true,
      requiredExtraResources: [wheat],
    });
    prompts.inject([factoryWorker]);
    await produceAtFactory(game);
    expect(game.resources).toEqual([bread]);
  });
  it("should produce a resource when the user is prompted for discard", async () => {
    const game = {
      cardsInHand: [bakery],
      cardsInDeck: [],
      cardsInDiscard: [],
      cardsInPlay: [],
      winner: null,
      players: [],
      availableActions: [playerActions.produceAtFactory],
      employees: [],
      assignedEmployees: [
        {
          name: "assigned",
          assignment: bakery,
          mode: {
            productionCount: 1,
            resourceSparingCount: 0,
          },
        },
      ],
      resources: [],
      marketResources: [wood],
    };
    const factoryWorker = {
      factoryWorker: game.assignedEmployees[0],
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

    await produceAtFactory(game);
    expect(game.resources).toEqual([bread]);
    expect(game.cardsInHand).toEqual([]);
    expect(game.cardsInDiscard).toEqual([bakery]);
  });
  it("should produce several resources if can chain production, relying only on the market", async () => {
    const game = {
      cardsInHand: [],
      cardsInDeck: [],
      cardsInDiscard: [],
      cardsInPlay: [],
      winner: null,
      players: [],
      availableActions: [playerActions.produceAtFactory],
      employees: [],
      assignedEmployees: [
        {
          name: "assigned",
          assignment: bakeryWithChain,
          mode: {
            productionCount: 1,
            resourceSparingCount: 0,
          },
        },
      ],
      resources: [],
      marketResources: [wood, wheat, wheat, wheat],
    };
    const factoryWorker = {
      factoryWorker: game.assignedEmployees[0],
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

    await produceAtFactory(game);
    console.log(game.resources);
    expect(game.resources).toEqual([bread, bread, bread]);
  });
  it("produces extra with an efficient worker, relying only on the market", async () => {
    const game = {
      cardsInHand: [],
      cardsInDeck: [],
      cardsInDiscard: [],
      cardsInPlay: [],
      winner: null,
      players: [],
      availableActions: [playerActions.produceAtFactory],
      employees: [],
      assignedEmployees: [
        {
          name: "assigned",
          assignment: bakeryWithChain,
          mode: {
            productionCount: 2,
            resourceSparingCount: 1, // this combo isn't realistic, but good for test
          },
        },
      ],
      resources: [],
      marketResources: [wood, wheat, wheat, wheat],
    };
    const factoryWorker = {
      factoryWorker: game.assignedEmployees[0],
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

    await produceAtFactory(game);
    console.log(game.resources);
    expect(game.resources).toEqual([bread, bread, bread, bread, bread]);
  });
  it("should produce several resources if can chain production, allowing player discard", async () => {
    const game = {
      cardsInHand: [bakery],
      cardsInDeck: [],
      cardsInDiscard: [],
      cardsInPlay: [],
      winner: null,
      players: [],
      availableActions: [playerActions.produceAtFactory],
      employees: [],
      assignedEmployees: [
        {
          name: "assigned",
          assignment: bakeryWithChain,
          mode: {
            productionCount: 1,
            resourceSparingCount: 0,
          },
        },
      ],
      resources: [],
      marketResources: [wood, wheat],
    };
    const factoryWorker = {
      factoryWorker: game.assignedEmployees[0],
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

    await produceAtFactory(game);
    console.log(game.resources);
    expect(game.resources).toEqual([bread, bread]);
  });
});
