import { GameState, PlayerState } from "../types";
import { drawCard } from "./draw-card";
import { endStep } from "./end-step";
import { reserveFactory } from "./reserve-factory";
import { assignEmployee } from "./assign-employee";
import { unassignEmployee } from "./unassign-employee";
import { buildFactory } from "./build-factory";
import { produceAtFactory } from "./production";

export enum PlayerActionEnum {
  endStep = "endStep",
  drawCard = "drawCard",
  discardCard = "discardCard",
  assignEmployee = "assignEmployee",
  reserveFactory = "reserveFactory",
  unassignEmployee = "unassignEmployee",
  produceAtFactory = "produceAtFactory",
  buildFactory = "buildFactory",
  hireWorker = "hireWorker",
}

export const playerActions = {
  [PlayerActionEnum.endStep]: endStep,
  [PlayerActionEnum.drawCard]: drawCard,
  [PlayerActionEnum.discardCard]: () => {},
  [PlayerActionEnum.assignEmployee]: assignEmployee,
  [PlayerActionEnum.reserveFactory]: reserveFactory,
  [PlayerActionEnum.unassignEmployee]: unassignEmployee,
  [PlayerActionEnum.produceAtFactory]: produceAtFactory,
  [PlayerActionEnum.buildFactory]: buildFactory,
  [PlayerActionEnum.hireWorker]: () => {},
};

export function newGame(): GameState {
  const gameState: GameState = {
    config: {
      marketSuns: 3,
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
    activeStep: 0,
  };
  return gameState;
}

export function newPlayer(): PlayerState {
  const playerState: PlayerState = {
    id: "",
    playerNumber: 0,
    player: { name: "test" },
    cardsInHand: [],
    cardsInPlay: [],
    availableActions: [],
    employees: [],
    assignedEmployees: [],
    resources: [],
    reservedFactory: null,
    score: 0,
  };
  return playerState;
}
