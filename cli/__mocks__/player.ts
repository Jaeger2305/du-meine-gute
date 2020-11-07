import { Player, PlayerState } from "../types";

export const defaultPlayer: Player = { name: "test-player-name-1" };

export const emptyPlayerState: PlayerState = {
  id: "test-player-id-1",
  playerNumber: 0,
  player: defaultPlayer,
  cardsInHand: [],
  cardsInPlay: [],
  availableActions: [],
  employees: [],
  assignedEmployees: [],
  resources: [],
  reservedFactory: null,
  score: 0,
};
