import { discard } from "./discard";
import { buildFactory } from "./build-factory";
import { assignEmployee } from "./assign-employee";
import { reserveFactory } from "./reserve-factory";
import { produceAtFactory } from "./production";
import { hireWorker } from "./hire-worker";
import { unassignEmployee } from "./unassign-employee";
import { GameState, PlayerActionEnum, PlayerState } from "../types";
import { drawCard } from "../local-server";

export const playerActions = {
  endStep: {
    type: PlayerActionEnum.endStep,
    handler: (gameState: GameState, playerState: PlayerState) => {
      playerState.availableActions = [];
    },
  },
  drawCard: {
    type: PlayerActionEnum.drawCard,
    handler: (gameState: GameState, playerState: PlayerState) => {
      const {
        response: { cardsInDeck, cardsInHand, cardsInDiscard },
      } = drawCard(gameState, playerState);
      playerState.cardsInHand = cardsInHand;
      gameState.cardsInDeck = cardsInDeck;
      gameState.cardsInDiscard = cardsInDiscard;
    },
  },
  discardCard: {
    type: PlayerActionEnum.discardCard,
    handler: discard,
  },
  assignEmployee: {
    type: PlayerActionEnum.assignEmployee,
    handler: assignEmployee,
  },
  reserveFactory: {
    type: PlayerActionEnum.reserveFactory,
    handler: reserveFactory,
  },
  produceAtFactory: {
    type: PlayerActionEnum.produceAtFactory,
    handler: produceAtFactory,
  },
  hireWorker: {
    type: PlayerActionEnum.hireWorker,
    handler: hireWorker,
  },
  buildFactory: {
    type: PlayerActionEnum.buildFactory,
    handler: buildFactory,
  },
  unassignEmployee: {
    type: PlayerActionEnum.unassignEmployee,
    handler: unassignEmployee,
  },
};

export function newGame(): GameState {
  const gameState: GameState = {
    cardsInDeck: [],
    cardsInDiscard: [],
    winner: null,
    players: [],
    availableEmployees: [],
    reservedCards: [],
    marketCards: [],
    score: 0,
  };
  return gameState;
}
