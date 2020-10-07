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
