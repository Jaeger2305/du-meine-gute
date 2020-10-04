import { discard } from "./discard";
import { buildFactory } from "./build-factory";
import { assignEmployee } from "./assign-employee";
import { reserveFactory } from "./reserve-factory";
import { produceAtFactory } from "./production";
import { hireWorker } from "./hire-worker";
import { unassignEmployee } from "./unassign-employee";
import { GameState, PlayerActionEnum, PlayerState } from "../types";
import { drawCard } from "./draw-card";
import { endStep } from "./end-step";

export const playerActions = {
  endStep: {
    type: PlayerActionEnum.endStep,
    handler: endStep,
  },
  drawCard: {
    type: PlayerActionEnum.drawCard,
    handler: drawCard,
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
    config: {
      marketSuns: 1,
      buildCountForEndGame: 4,
      drawCount: 2,
      pointsPerResource: 0.25,
      workerCount: 4, // should be dependent on number of players
    },
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
