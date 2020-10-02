import { sum } from "lodash";
import {
  GameState,
  Card,
  Employee,
  AssignedEmployee,
  ProductionEfficiency,
  Resource,
  PlayerActionEnum,
  PlayerState,
} from "../types";
import { bread, leather, coal } from "../resources";
import { playerActions } from "../game";
import {
  bakery,
  tannery,
  skilledApprentice,
  apprentice,
  master,
  boss,
  altBakery,
  sawmill,
  bakeryWithChain,
  altTannery,
  office,
  glassblower,
  coalMineBrick,
  coalMineMetal,
  coalMineWool,
  coalMineWheat,
} from "../game/cards";
import { removeActionFromAvailableActions } from "../game/utils";

type ServerResponse = {
  response: any;
};

/**
 * I don't remember what this was for
 */
function gameReady() {}

export const roundSteps: Array<(
  gameState: GameState,
  playerState: PlayerState
) => ServerResponse> = [
  startRound,
  draw,
  revealMarket,
  assignEmployees,
  revealMarket,
  produce,
  purchase,
  endRound,
];

/**
 * Called twice, once before assigning workers and once after.
 * Resources are revealed from the deck until 3 cards with suns are drawn.
 * Returns valid actions that can be performed, specific for this round.
 * This is normally just an acknowledgement, as the players can't choose anything here.
 */
function revealMarket(
  gameState: GameState,
  playerState: PlayerState
): ServerResponse {
  playerState.availableActions = [playerActions.endStep];

  const marketCards: Array<Card> = [];

  // Draw cards until 3 suns.
  while (
    marketCards.filter((card) => card.isSunny).length <
    gameState.config.marketSuns
  ) {
    // If no cards, shuffle discard
    if (!gameState.cardsInDeck.length) {
      gameState.cardsInDeck = gameState.cardsInDiscard.slice();
      gameState.cardsInDiscard = [];
    }
    const drawnCard = gameState.cardsInDeck.splice(0, 1);
    marketCards.push(...drawnCard);
  }
  gameState.marketCards.push(...marketCards);

  return {
    response: {
      drawnCards: marketCards,
      availableActions: playerState.availableActions,
      marketCards: gameState.marketCards,
    },
  };
}

/**
 * Reveals a card from the deck after the user has requested drawing a card.
 * Returns the function to update the client game state
 */
export function drawCard(
  gameState: GameState,
  playerState: PlayerState
): ServerResponse {
  // If there are no cards to draw from, shuffle the discard.
  if (!gameState.cardsInDeck.length) {
    gameState.cardsInDeck = gameState.cardsInDiscard.slice().reverse();
    gameState.cardsInDiscard = [];
  }

  // Draw the card
  const drawnCard = gameState.cardsInDeck.splice(0, 1);
  playerState.cardsInHand.splice(0, 0, ...drawnCard);

  // Find the event and delete it
  removeActionFromAvailableActions(playerState, PlayerActionEnum.drawCard);

  // Send the response back
  const response = {
    drawnCard,
    cardsInDiscard: gameState.cardsInDiscard,
    cardsInDeck: gameState.cardsInDeck,
    cardsInHand: playerState.cardsInHand,
  };
  return {
    response,
  };
}

export function produceGood(
  gameState: GameState,
  playerState: PlayerState,
  resource: Resource
): ServerResponse {
  console.warn("No validation of goods production by the server");
  return {
    response: { isOK: true },
  };
}

/**
 * Puts a card from a players hand into play.
 * Returns the function to update the client game state
 */
export function buildFactory(
  gameState: GameState,
  playerState: PlayerState,
  resources: Array<Resource>
): ServerResponse {
  console.warn("No validation of build factory by the server");
  return {
    response: { isOK: true },
  };
}

/**
 * Puts a card from the available worker pool into the employees of a user.
 * Returns the function to update the client game state
 */
export function hireWorker(
  gameState: GameState,
  playerState: PlayerState,
  worker: Employee,
  resources: Array<Resource>
): ServerResponse {
  console.warn("No validation of hiring worker");
  return {
    response: { isOK: true },
  };
}

export function unassignWorker(
  gameState: GameState,
  playerState: PlayerState,
  worker: AssignedEmployee,
  resources: Array<Resource>
): ServerResponse {
  console.warn("No validation of goods production by the server");
  return {
    response: { isOK: true },
  };
}

/**
 *
 */
function generateTestCards(): Array<Card> {
  return [
    bakery,
    tannery,
    altBakery,
    sawmill,
    bakery,
    bakeryWithChain,
    tannery,
    tannery,
    bakeryWithChain,
    bakeryWithChain,
    altBakery,
    altTannery,
    altTannery,
  ];
}

/**
 * Initialises the deck of cards
 * Returns valid actions that can be performed, which is just acknowledgements
 */
export function setupGame(game: GameState): void {
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
      resources: [bread, leather, bread, bread, leather, coal],
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

/**
 * Returns valid actions that can be performed, which is drawing 3 cards.
 * After drawing, the user is allowed to discard 2 cards as well, but that's appended after completing the drawing.
 */
function startRound(
  gameState: GameState,
  playerState: PlayerState
): ServerResponse {
  playerState.availableActions = [
    playerActions.discardCard,
    playerActions.endStep,
  ];
  gameState.marketCards = [];
  return {
    response: {
      availableActions: playerState.availableActions,
    },
  };
}

/**
 * Returns valid actions that can be performed, which is drawing 3 cards.
 * After drawing, the user is allowed to discard 2 cards as well, but that's appended after completing the drawing.
 */
function draw(gameState: GameState, playerState: PlayerState): ServerResponse {
  const drawCardCount =
    gameState.config.drawCount +
    sum(
      playerState.cardsInPlay.map((card) => card.boostDrawCount).filter(Boolean)
    );
  const drawCardActions = new Array(drawCardCount).fill(playerActions.drawCard);
  playerState.availableActions = [...drawCardActions, playerActions.endStep];
  return {
    response: {
      availableActions: playerState.availableActions,
    },
  };
}

/**
 * Initiate the assignment step in the round
 * The returns valid actions that can be performed specific for this round.
 */
function assignEmployees(
  gameState: GameState,
  playerState: PlayerState
): ServerResponse {
  playerState.availableActions = [
    playerActions.assignEmployee,
    playerActions.reserveFactory,
    playerActions.endStep,
  ];
  return {
    response: {
      availableActions: playerState.availableActions,
    },
  };
}

export function reserveFactory(
  gameState: GameState,
  playerState: PlayerState,
  factory: Card
) {
  console.warn("No validation of build factory by the server");
  return {
    response: { isOK: true },
  };
}

/**
 * Initiate the assignment step in the round
 * The returns valid actions that can be performed specific for this round.
 */
export function assignEmployee(
  gameState: GameState,
  playerState: PlayerState,
  employee: Employee,
  mode: ProductionEfficiency,
  factory: Card
): ServerResponse {
  // Validate action
  console.warn("No validation of assignment");

  return {
    response: {
      isOK: true,
    },
  };
}

/**
 * Initiate the production step in the round
 * Pick one of the assigned workers to produce at that factory.
 * Starting production requires having access to the resource required for its production
 * If the primary worker, one resource can be omitted, but it means only 1 good is produced.
 * This is decided during the assign workers phase.
 *
 * Returns the valid actions that can be performed specific for this round.
 * This includes
 *  - produceAtFactory (for each factory with a worker assigned)
 */
function produce(
  gameState: GameState,
  playerState: PlayerState
): ServerResponse {
  playerState.availableActions = [
    playerActions.produceAtFactory,
    playerActions.endStep,
  ];
  return {
    response: {
      availableActions: playerState.availableActions,
    },
  };
}

/**
 * Initiate the purchase step in the round
 * Starting production requires having access to the resource required for its production
 * If the primary worker, one resource can be omitted, but it means only 1 good is produced.
 * This is decided during the assign workers phase.
 *
 * Returns the valid actions that can be performed specific for this round.
 * This could include hiring a worker, building a factory, or skipping
 */
function purchase(
  gameState: GameState,
  playerState: PlayerState
): ServerResponse {
  playerState.availableActions = [
    playerActions.hireWorker,
    playerActions.unassignEmployee,
    playerActions.buildFactory,
    playerActions.endStep,
  ];
  return {
    response: {
      availableActions: playerState.availableActions,
    },
  };
}

/**
 * Initiate the final step in the round
 * Check if there is a game end condition (if a player has 8 buildings), and tot up the scores.
 * Returns the valid actions that can be performed for this round.
 * Either acknowledge and a return to the startRound action, or nothing, meaning the game has ended and all they can do is leave.
 */
function endRound(
  gameState: GameState,
  playerState: PlayerState
): ServerResponse {
  const isGameEnd = gameState.isGameEnding; // if marked as game ending last round, mark as finished here.
  gameState.isGameEnding =
    playerState.cardsInPlay.length >= gameState.config.buildCountForEndGame;
  playerState.availableActions = isGameEnd ? [] : [playerActions.endStep];
  gameState.winner = isGameEnd ? playerState.player : null;
  const resourcesScore = Math.floor(
    sum(playerState.resources.map((resource) => resource.value)) *
      gameState.config.pointsPerResource
  );
  const factoryScore = sum(playerState.cardsInPlay.map((card) => card.points));
  const employeeScore = sum(
    playerState.employees.map((employee) => employee.points)
  );
  playerState.score = sum([resourcesScore, factoryScore, employeeScore]);

  console.log("current score: ", playerState.score);

  // Reset worker production states
  playerState.assignedEmployees = playerState.assignedEmployees.map(
    (employee) => ({
      ...employee,
      hasProduced: false,
    })
  );

  // If at the end of the game, assign investors for free.
  if (gameState.isGameEnding) {
    const assignedFactories = playerState.assignedEmployees.map(
      (employee) => employee.assignment.name
    );
    const unassignedFactories = playerState.cardsInPlay.filter(
      (card) => !assignedFactories.includes(card.name) && card.productionConfig
    );
    const investorAssignments: Array<AssignedEmployee> = unassignedFactories.map(
      (factory, index) => ({
        name: `investor ${index} - ${
          factory.name
        } - ${factory.productionConfig.output.join()}`,
        mode: { productionCount: 1, resourceSparingCount: 0 },
        unassignmentCost: 0,
        assignment: factory,
      })
    );
    playerState.assignedEmployees.push(...investorAssignments);
  }

  // Discard the market
  gameState.cardsInDiscard.push(...gameState.marketCards);
  gameState.marketCards = [];

  return {
    response: {
      assignedEmployees: playerState.assignedEmployees,
      availableActions: playerState.availableActions,
      winner: gameState.winner,
    },
  };
}
