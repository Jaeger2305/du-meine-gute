import { GameState, PlayerState } from "../types";
import { drawCard } from "./draw-card";
import { discard } from "./discard";
import { endStep } from "./end-step";
import { reserveFactory } from "./reserve-factory";
import { unreserveFactory } from "./unreserve-factory";
import { assignEmployee } from "./assign-employee";
import { unassignEmployee } from "./unassign-employee";
import { buildFactory } from "./build-factory";
import { produceAtFactory } from "./production";
import { hireEmployee } from "./hire-employee";

export enum PlayerActionEnum {
  endStep = "endStep",
  drawCard = "drawCard",
  discard = "discard",
  assignEmployee = "assignEmployee",
  reserveFactory = "reserveFactory",
  unreserveFactory = "unreserveFactory",
  unassignEmployee = "unassignEmployee",
  produceAtFactory = "produceAtFactory",
  buildFactory = "buildFactory",
  hireEmployee = "hireEmployee",
}

export const playerActions = {
  [PlayerActionEnum.endStep]: endStep,
  [PlayerActionEnum.drawCard]: drawCard,
  [PlayerActionEnum.discard]: discard,
  [PlayerActionEnum.assignEmployee]: assignEmployee,
  [PlayerActionEnum.reserveFactory]: reserveFactory,
  [PlayerActionEnum.unreserveFactory]: unreserveFactory,
  [PlayerActionEnum.unassignEmployee]: unassignEmployee,
  [PlayerActionEnum.produceAtFactory]: produceAtFactory,
  [PlayerActionEnum.buildFactory]: buildFactory,
  [PlayerActionEnum.hireEmployee]: hireEmployee,
};

export function newGame(): GameState {
  const gameState: GameState = {
    config: {
      marketSuns: 4,
      buildCountForEndGame: 4,
      drawCount: 2,
      pointsPerResource: 0.25,
      workerCount: 4, // should be dependent on number of players
      isTutorialEnabled: true,
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
