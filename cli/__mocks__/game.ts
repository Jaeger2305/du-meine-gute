import { GameState } from "../types";
import { emptyPlayerState } from "./player";

export const emptyGame: GameState = {
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
