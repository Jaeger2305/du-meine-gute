import { GameState, PlayerState } from "../types";
import { bread, leather, coal } from "../resources";
import { playerActions } from "../game";
import {
  tannery,
  skilledApprentice,
  apprentice,
  master,
  boss,
  office,
  glassblower,
  coalMineBrick,
  coalMineMetal,
  coalMineWool,
  coalMineWheat,
  bakery,
  sawmill,
  tradingPost,
} from "../game/cards";
import { generateTestCards } from "./utils";

export { roundSteps } from "./round-steps";

/**
 * Initialises the deck of cards
 * Returns valid actions that can be performed, which is just acknowledgements
 */
export function setupGame(game: GameState): void {
  game.reservedCards.push(tannery, glassblower, bakery, sawmill, tradingPost);
  game.cardsInDeck.push(...generateTestCards());
  game.availableEmployees = [skilledApprentice, apprentice, master];

  const coalMines = [coalMineWheat, coalMineBrick, coalMineMetal, coalMineWool];
  const chosenCoalMine = coalMines[Math.floor(Math.random() * 4)];
  const players: Array<PlayerState> = [
    {
      id: "test-player-id-1",
      playerNumber: 0,
      employees: [boss, master],
      cardsInHand: [office, tannery],
      cardsInPlay: [chosenCoalMine, glassblower],
      resources: [bread, leather, bread, leather, coal],
      availableActions: [playerActions.endStep],
      assignedEmployees: [],
      reservedFactory: null,
      score: 0,
      player: { name: "test-player-name-1" },
    },
  ];
  game.players = players;
  return;
}
