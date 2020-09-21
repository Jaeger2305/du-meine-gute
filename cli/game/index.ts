import * as prompts from "prompts";
import { buildFactory } from "./buildFactory";
import { assignEmployee } from "./assignEmployee";
import { produceAtFactory } from "./production";
import { GameState } from "../types";
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
    handler: async (gameState: GameState) => {
      const cardChoice = await prompts({
        type: "select",
        message: `pick a card to discard, and gain that resource`,
        name: "card",
        choices: gameState.cardsInHand.map((card, index) => ({
          title: card.name,
          value: { card, index },
        })),
      });
      gameState.cardsInHand.splice(cardChoice.card.index, 1);
      gameState.cardsInDiscard.push(cardChoice.card.card);
      gameState.resources.push(cardChoice.card.card.resource);
    },
  },
  assignEmployee: {
    type: "assignEmployee",
    handler: assignEmployee,
  },
  produceAtFactory: {
    type: "produceAtFactory",
    handler: produceAtFactory,
  },
  hireWorker: {
    type: "hireWorker",
    handler: async (gameState: GameState) => {},
  },
  buildFactory: {
    type: "buildFactory",
    handler: buildFactory,
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
    employees: [],
    assignedEmployees: [],
    resources: [],
    marketResources: [],
  };
  return gameState;
}
