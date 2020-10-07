import { GameState } from "../types";
import { emptyPlayerState } from "./player";

export const emptyGame: GameState = {
  config: {
    marketSuns: 3,
    buildCountForEndGame: 8,
    drawCount: 2,
    pointsPerResource: 0.25,
    workerCount: 4,
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

export const defaultGame = { ...emptyGame, players: [emptyPlayerState] };
