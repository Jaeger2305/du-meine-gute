import {
  GameState,
  ServerActionEnum,
  PlayerState,
  PlayerActionEnum,
} from "../types";
import { bread, leather, coal } from "../resources";
import {
  coalMineClay,
  coalMineMetal,
  coalMineWool,
  coalMineWheat,
  cardRecords,
} from "../cards";
import { seedWorkers, boss } from "../worker";
import { generateTestCards } from "./utils";

export { roundSteps } from "./round-steps";
import { drawCard } from "./actions/draw-card";
import { endStep } from "./actions/end-step";
import { reserveFactory } from "./actions/reserve-factory";
import { assignWorkers } from "./round-steps/assign-workers";

/**
 * Initialises the deck of cards
 * Returns valid actions that can be performed, which is just acknowledgements
 */
export function setupGame(game: GameState): void {
  game.reservedCards.push(
    cardRecords.TANNERY_METAL_WOOD,
    cardRecords.GLASSMAKER,
    cardRecords.BAKERY_CLAY,
    cardRecords.SAWMILL_CLAY_METAL,
    cardRecords.MARKET_OFFICE_CLAY1
  );
  game.cardsInDeck.push(...generateTestCards());
  game.availableEmployees.push(...seedWorkers(game.config.workerCount));

  const coalMines = [coalMineWheat, coalMineClay, coalMineMetal, coalMineWool];
  const chosenCoalMine = coalMines[Math.floor(Math.random() * 4)];
  const players: Array<PlayerState> = [
    {
      id: "test-player-id-1",
      playerNumber: 0,
      employees: [boss],
      cardsInHand: [
        cardRecords.MARKET_OFFICE_CLAY2,
        cardRecords.TANNERY_WHEAT_WOOL,
      ],
      cardsInPlay: [chosenCoalMine, cardRecords.GLASSMAKER_SUN],
      resources: [bread, leather, bread, leather, coal],
      availableActions: [PlayerActionEnum.endStep],
      assignedEmployees: [],
      reservedFactory: null,
      score: 0,
      player: { name: "test-player-name-1" },
    },
  ];
  game.players = players;
  return;
}
type ServerActionHandler = (
  serverState: GameState,
  playerNumber: PlayerState["playerNumber"],
  playerActionResponse?: any
) => void;

export const serverActions: Record<ServerActionEnum, ServerActionHandler> = {
  [ServerActionEnum.drawCard]: drawCard,
  [ServerActionEnum.endStep]: endStep,
  [ServerActionEnum.assignWorkers]: assignWorkers,
  [ServerActionEnum.reserveFactory]: reserveFactory,
  [ServerActionEnum.revealMarket]: () => {},
  [ServerActionEnum.startRound]: () => {},
};
