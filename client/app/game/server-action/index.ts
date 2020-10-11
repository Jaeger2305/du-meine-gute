import {
  GameState,
  PlayerState,
  PlayerActionEnum,
} from "../types";
import {
  ServerActionHandler,ServerActionEnum} from "./types";
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

import { drawCard } from "./actions/draw-card";
import { endStep } from "./actions/end-step";
import { reserveFactory } from "./actions/reserve-factory";
import { drawStep } from "./round-steps/draw-step";
import { assignmentStep } from "./round-steps/assignment-step";
import { purchaseStep } from "./round-steps/purchase-step";
import { revealMarket } from './round-steps/reveal-market';
import { startRound } from './round-steps/start-round';
import { assignEmployee } from './actions/assign-employee';
import { buildFactory } from './actions/build-factory';

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

export const serverActions: Record<ServerActionEnum, ServerActionHandler> = {
  // Standalone actions
  [ServerActionEnum.drawCard]: drawCard,
  [ServerActionEnum.reserveFactory]: reserveFactory,
  [ServerActionEnum.buildFactory]: buildFactory,
  [ServerActionEnum.assignEmployee]: assignEmployee,
  [ServerActionEnum.endStep]: endStep,

  // Steps
  [ServerActionEnum.drawStep]: drawStep,
  [ServerActionEnum.assignWorkers]: assignmentStep,
  [ServerActionEnum.revealMarket]: revealMarket,
  [ServerActionEnum.startRound]: startRound,
  [ServerActionEnum.purchaseStep]: purchaseStep,
};

export const RoundSteps = [
  ServerActionEnum.startRound,
  ServerActionEnum.drawStep,
  ServerActionEnum.revealMarket,
  ServerActionEnum.assignWorkers,
  ServerActionEnum.revealMarket,
  ServerActionEnum.purchaseStep,
];