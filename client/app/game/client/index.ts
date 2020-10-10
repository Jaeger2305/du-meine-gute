import { GameState, PlayerActionEnum, PlayerState } from "../types";
import { drawCard } from "./draw-card";
import { endStep } from "./end-step";
import { reserveFactory } from "./reserve-factory";

type PlayerActionResponse = any;

type PlayerActionHandler = (
  gameState: GameState,
  playerState: PlayerState,
  payload: any
) => PlayerActionResponse;

export const playerActions: Record<PlayerActionEnum, PlayerActionHandler> = {
  [PlayerActionEnum.endStep]: endStep,
  [PlayerActionEnum.drawCard]: drawCard,
  [PlayerActionEnum.discardCard]: () => {},
  [PlayerActionEnum.assignEmployee]: () => {},
  [PlayerActionEnum.reserveFactory]: reserveFactory,
  [PlayerActionEnum.unassignEmployee]: () => {},
  [PlayerActionEnum.produceAtFactory]: () => {},
  [PlayerActionEnum.buildFactory]: () => {},
  [PlayerActionEnum.hireWorker]: () => {},
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
