import { GameState, PlayerState, PlayerActionEnum, Employee } from "../types";
import { ServerActionHandler, ServerActionEnum } from "./types";
import { bread, leather, coal, wheat } from "../resources";
import {
  coalMineClay,
  coalMineMetal,
  coalMineWool,
  coalMineWheat,
  cardRecords,
} from "../cards";
import { seedWorkers, boss } from "../worker";
import { generateTestCards } from "./utils";

import { discard } from "./actions/discard";
import { drawCard } from "./actions/draw-card";
import { endStep } from "./actions/end-step";
import { reserveFactory } from "./actions/reserve-factory";
import { hireEmployee } from "./actions/hire-employee";
import { drawStep } from "./round-steps/draw-step";
import { assignmentStep } from "./round-steps/assignment-step";
import { produceStep } from "./round-steps/produce-step";
import { purchaseStep } from "./round-steps/purchase-step";
import { revealMarket } from "./round-steps/reveal-market";
import { startRound } from "./round-steps/start-round";
import { endRound } from "./round-steps/end-round";
import { assignEmployee } from "./actions/assign-employee";
import { unassignEmployee } from "./actions/unassign-employee";
import { buildFactory } from "./actions/build-factory";
import { produceAtFactory } from "./actions/produce-at-factory";

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

  // Just use a mock value for now, while testing the unassignment cost
  const master: Employee = {
    modes: [{ productionCount: 1, resourceSparingCount: 0 }],
    name: "master-1",
    resourceSpecialty: [wheat],
    cost: 5,
    points: 4,
    unassignmentCost: 2,
  };

  const players: Array<PlayerState> = [
    {
      id: "test-player-id-1",
      playerNumber: 0,
      employees: [master, boss], // Currently, the first item is assigned without questions in the assignment phase.
      cardsInHand: [
        cardRecords.MARKET_OFFICE_CLAY2,
        cardRecords.TANNERY_WHEAT_WOOL,
      ],
      cardsInPlay: [chosenCoalMine, cardRecords.GLASSMAKER_SUN],
      resources: [bread, leather, bread, leather, coal],
      availableActions: [PlayerActionEnum.endStep, PlayerActionEnum.discard],
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
  [ServerActionEnum.discard]: discard,
  [ServerActionEnum.drawCard]: drawCard,
  [ServerActionEnum.reserveFactory]: reserveFactory,
  [ServerActionEnum.buildFactory]: buildFactory,
  [ServerActionEnum.produceAtFactory]: produceAtFactory,
  [ServerActionEnum.assignEmployee]: assignEmployee,
  [ServerActionEnum.unassignEmployee]: unassignEmployee,
  [ServerActionEnum.hireEmployee]: hireEmployee,
  [ServerActionEnum.endStep]: endStep,

  // Steps
  [ServerActionEnum.startRound]: startRound,
  [ServerActionEnum.drawStep]: drawStep,
  [ServerActionEnum.revealMarket]: revealMarket,
  [ServerActionEnum.assignWorkers]: assignmentStep,
  [ServerActionEnum.produceStep]: produceStep,
  [ServerActionEnum.purchaseStep]: purchaseStep,
  [ServerActionEnum.endRound]: endRound,
};

export const RoundSteps = [
  ServerActionEnum.startRound,
  ServerActionEnum.drawStep,
  ServerActionEnum.revealMarket,
  ServerActionEnum.assignWorkers,
  ServerActionEnum.revealMarket,
  ServerActionEnum.produceStep,
  ServerActionEnum.purchaseStep,
  ServerActionEnum.endRound,
];
