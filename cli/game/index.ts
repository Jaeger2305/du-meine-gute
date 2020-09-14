import * as prompts from "prompts";
import { drawCard, playCard } from "../local-server";

export const playerActions = {
  endStep: {
    type: "endStep",
    handler: (gameState: GameState) => {
      gameState.availableActions = [];
    },
  },
  drawCard: {
    type: "drawCard",
    handler: (gameState: GameState) => {
      const {
        response: { cardsInDeck, cardsInHand, cardsInDiscard },
      } = drawCard(gameState);
      gameState.cardsInHand = cardsInHand;
      gameState.cardsInDeck = cardsInDeck;
      gameState.cardsInDiscard = cardsInDiscard;
    },
  },
  discardCard: {
    type: "discardCard",
    handler: async (gameState: GameState) => {},
  },
  assignWorker: {
    type: "assignWorker",
    handler: async (gameState: GameState) => {},
  },
  useMarketCard: {
    type: "useMarketCard",
    handler: async (gameState: GameState) => {},
  },
  useResource: {
    type: "useResource",
    handler: async (gameState: GameState) => {},
  },
  produceAtFactory: {
    type: "produceAtFactory",
    handler: async (gameState: GameState) => {},
  },
  hireWorker: {
    type: "hireWorker",
    handler: async (gameState: GameState) => {},
  },
  buildFactory: {
    type: "buildFactory",
    handler: async (gameState: GameState) => {
      const cardChoice = await prompts({
        type: "select",
        message: `pick an card to play`,
        name: "card",
        choices: gameState.cardsInHand.map((card) => ({
          title: card.name,
          value: card,
        })),
      });
      const {
        response: { cardsInPlay, cardsInHand },
      } = playCard(gameState, cardChoice.card);
      gameState.cardsInPlay = cardsInPlay;
      gameState.cardsInHand = cardsInHand;
    },
  },
};

export function newGame(): GameState {
  const gameState: GameState = {
    cardsInHand: [],
    cardsInDeck: [],
    cardsInDiscard: [],
    cardsInPlay: [],
    winner: null,
    players: [],
    availableActions: [],
  };
  return gameState;
}
