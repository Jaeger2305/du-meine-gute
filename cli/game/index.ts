import * as prompts from "prompts";
import { produceAtFactory } from "./production";
import { GameState } from "../types";
import { drawCard, playCard, assignEmployee } from "../local-server";

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
    handler: async (gameState: GameState) => {
      // pick an employee
      const employeeChoice = await prompts({
        type: "select",
        message: `pick a worker to assign`,
        name: "employee",
        choices: gameState.employees.map((employee) => ({
          title: employee.name,
          value: employee,
        })),
      });

      // Still need to loop over all workers
      // And decide on efficiency

      // Pick the building to choose, based on material speciality (not implemented yet)
      const cardChoice = await prompts({
        type: "select",
        message: `pick an in-play card to assign the worker`,
        name: "card",
        choices: gameState.cardsInPlay.map((card) => ({
          title: card.name,
          value: card,
        })),
      });

      // No error checking
      const {
        response: { availableActions, assignedEmployees },
      } = assignEmployee(gameState, employeeChoice.employee, cardChoice.card);
      gameState.availableActions = availableActions;
      gameState.assignedEmployees = assignedEmployees;
    },
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
    employees: [],
    assignedEmployees: [],
    resources: [],
    marketResources: [],
  };
  return gameState;
}
