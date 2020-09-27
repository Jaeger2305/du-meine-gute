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
import { altBakery, bakery, bakeryWithChain, sawmill, tannery } from "../cards";
import { produceAtFactory } from "./index";
import { iteratee } from "lodash";

beforeEach(() => {
  Object.values(mockActions).forEach((mock) => mock.mockClear());
});

describe("produce at factory", () => {
  it("should produce a resource when everything is present in the market", async () => {
    const game = {
      cardsInHand: [],
      cardsInDeck: [bakery],
      cardsInDiscard: [],
      cardsInPlay: [],
      winner: null,
      players: [],
      availableActions: [playerActions.produceAtFactory],
      availableEmployees: [],
      employees: [],
      assignedEmployees: [
        {
          name: "assigned",
          assignment: bakery,
          mode: {
            productionCount: 1,
            resourceSparingCount: 0,
          },
          unassignmentCost: 0,
        },
      ],
      resources: [],
      reservedCards: [],
      reservedFactory: null,
      marketCards: [sawmill, altBakery],
      score: 0,
    };
    const factoryWorker = {
      ...game.assignedEmployees[0],
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
      availableEmployees: [],
      assignedEmployees: [
        {
          name: "assigned",
          assignment: bakery,
          mode: {
            productionCount: 1,
            resourceSparingCount: 1,
          },
          unassignmentCost: 0,
        },
      ],
      resources: [],
      reservedCards: [],
      reservedFactory: null,
      marketCards: [sawmill],
      score: 0,
    };
    const factoryWorker = {
      ...game.assignedEmployees[0],
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
      cardsInDeck: [tannery],
      cardsInDiscard: [],
      cardsInPlay: [],
      winner: null,
      players: [],
      availableActions: [playerActions.produceAtFactory],
      employees: [],
      availableEmployees: [],
      assignedEmployees: [
        {
          name: "assigned",
          assignment: bakery,
          mode: {
            productionCount: 1,
            resourceSparingCount: 0,
          },
          unassignmentCost: 0,
        },
      ],
      resources: [],
      reservedCards: [],
      reservedFactory: null,
      marketCards: [sawmill],
      score: 0,
    };
    const factoryWorker = {
      ...game.assignedEmployees[0],
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
    await produceAtFactory(game);
    expect(game.resources).toEqual([bread]);
    expect(game.cardsInHand).toEqual([]);
    expect(game.cardsInDiscard).toEqual([bakery]);
  });
  it("should produce several resources if can chain production, relying only on the market", async () => {
    // This isn't actually in the official rules! Surprisingly, players can only chain using cards from their hand.
    const game = {
      cardsInHand: [],
      cardsInDeck: [],
      cardsInDiscard: [],
      cardsInPlay: [],
      winner: null,
      players: [],
      availableActions: [playerActions.produceAtFactory],
      employees: [],
      availableEmployees: [],
      assignedEmployees: [
        {
          name: "assigned",
          assignment: bakeryWithChain,
          mode: {
            productionCount: 1,
            resourceSparingCount: 0,
          },
          unassignmentCost: 0,
        },
      ],
      resources: [],
      reservedCards: [],
      reservedFactory: null,
      marketCards: [sawmill, altBakery, altBakery, altBakery],
      score: 0,
    };
    const factoryWorker = {
      ...game.assignedEmployees[0],
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
      availableEmployees: [],
      assignedEmployees: [
        {
          name: "assigned",
          assignment: bakeryWithChain,
          mode: {
            productionCount: 2,
            resourceSparingCount: 1, // this combo isn't realistic, but good for test
          },
          unassignmentCost: 0,
        },
      ],
      resources: [],
      reservedCards: [],
      reservedFactory: null,
      marketCards: [sawmill, altBakery, altBakery, altBakery],
      score: 0,
    };
    const factoryWorker = {
      ...game.assignedEmployees[0],
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
    await produceAtFactory(game);
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
      availableEmployees: [],
      assignedEmployees: [
        {
          name: "assigned",
          assignment: bakeryWithChain,
          mode: {
            productionCount: 1,
            resourceSparingCount: 0,
          },
          unassignmentCost: 0,
        },
      ],
      resources: [],
      reservedCards: [],
      reservedFactory: null,
      marketCards: [sawmill, altBakery],
      score: 0,
    };
    const factoryWorker = {
      ...game.assignedEmployees[0],
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
    await produceAtFactory(game);
    expect(game.resources).toEqual([bread, bread]);
  });
  it("should produce multiple resources if chaining production that requires multiple secondary input", async () => {
    const game = {
      cardsInHand: [],
      cardsInDeck: [],
      cardsInDiscard: [],
      cardsInPlay: [],
      winner: null,
      players: [],
      availableActions: [playerActions.produceAtFactory],
      employees: [],
      availableEmployees: [],
      assignedEmployees: [
        {
          name: "assigned",
          assignment: {
            name: "bakery-3",
            type: "test",
            resource: wheat,
            productionConfig: {
              output: [bread],
              input: [wood, wheat],
              chainInput: [butter, coal],
            },
            cost: 3,
          },
          mode: {
            productionCount: 1,
            resourceSparingCount: 0,
          },
          unassignmentCost: 0,
        },
      ],
      resources: [butter, coal],
      reservedCards: [],
      reservedFactory: null,
      marketCards: [sawmill, altBakery],
      score: 0,
    };
    const factoryWorker = {
      ...game.assignedEmployees[0],
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
    await produceAtFactory(game);
    expect(game.resources).toEqual([bread, bread, bread]);
  });
  it("should not produce if the market contains chainable input but the hand doesn't", async () => {
    const game = {
      cardsInHand: [],
      cardsInDeck: [],
      cardsInDiscard: [],
      cardsInPlay: [],
      winner: null,
      players: [],
      availableActions: [playerActions.produceAtFactory],
      employees: [],
      availableEmployees: [],
      assignedEmployees: [
        {
          name: "assigned",
          assignment: {
            name: "bakery-3",
            type: "test",
            resource: wheat,
            productionConfig: {
              output: [bread],
              input: [wood],
              chainInput: [wheat],
            },
            cost: 3,
          },
          mode: {
            productionCount: 1,
            resourceSparingCount: 0,
          },
          unassignmentCost: 0,
        },
      ],
      resources: [],
      reservedCards: [],
      reservedFactory: null,
      marketCards: [sawmill, altBakery],
      score: 0,
    };
    const factoryWorker = {
      ...game.assignedEmployees[0],
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
    await produceAtFactory(game);
    expect(game.resources).toEqual([bread]);
  });
});
