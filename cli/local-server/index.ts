import { sum } from "lodash";
import {
  GameState,
  Card,
  Employee,
  AssignedEmployee,
  ProductionEfficiency,
  Resource,
  PlayerActionEnum,
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

export const roundSteps: Array<(gameState: GameState) => ServerResponse> = [
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
function revealMarket(gameState: GameState): ServerResponse {
  gameState.availableActions = [playerActions.endStep];

  const marketCards: Array<Card> = [];

  // Draw cards until 3 suns.
  while (marketCards.filter((card) => card.isSunny).length < 1) {
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
      availableActions: gameState.availableActions,
      marketCards: gameState.marketCards,
    },
  };
}

/**
 * Reveals a card from the deck after the user has requested drawing a card.
 * Returns the function to update the client game state
 */
export function drawCard(gameState: GameState): ServerResponse {
  // If there are no cards to draw from, shuffle the discard.
  if (!gameState.cardsInDeck.length) {
    gameState.cardsInDeck = gameState.cardsInDiscard.slice().reverse();
    gameState.cardsInDiscard = [];
  }

  // Draw the card
  const drawnCard = gameState.cardsInDeck.splice(0, 1);
  gameState.cardsInHand.splice(0, 0, ...drawnCard);

  // Find the event and delete it
  const drawCardActionIndex = gameState.availableActions.findIndex(
    (a) => a.type === "drawCard"
  );
  gameState.availableActions.splice(drawCardActionIndex, 1);

  // Send the response back
  const response = {
    drawnCard,
    cardsInDiscard: gameState.cardsInDiscard,
    cardsInDeck: gameState.cardsInDeck,
    cardsInHand: gameState.cardsInHand,
  };
  return {
    response,
  };
}

export function produceGood(
  gameState: GameState,
  resource: Resource
): ServerResponse {
  // If there are no cards to draw from, shuffle the discard.
  if (!gameState.cardsInDeck.length) {
    gameState.cardsInDeck = gameState.cardsInDiscard.slice().reverse();
    gameState.cardsInDiscard = [];
  }

  // Draw the card into the reserved card space
  const drawnCard = gameState.cardsInDeck.splice(0, 1);
  gameState.reservedCards.push(...drawnCard);
  gameState.resources.push(resource);

  // Send the response back
  const response = {
    cardsInDiscard: gameState.cardsInDiscard,
    cardsInDeck: gameState.cardsInDeck,
    resources: gameState.resources,
  };
  return {
    response,
  };
}

/**
 * Puts a card from a players hand into play.
 * Returns the function to update the client game state
 */
export function buildFactory(
  gameState: GameState,
  card: Card,
  resources: Array<Resource>
): ServerResponse {
  if (!gameState.cardsInDeck.length) {
    gameState.cardsInDeck = gameState.cardsInDiscard.slice().reverse();
    gameState.cardsInDiscard = [];
  }
  const playedCard = gameState.reservedFactory;
  gameState.cardsInPlay.push(playedCard);

  // Unreserve cards and put them in the discard
  // The order shouldn't matter - they're unknown to all.
  const usedGoods = gameState.reservedCards.splice(0, resources.length);
  gameState.cardsInDiscard.push(...usedGoods);

  // Find the resources and delete them.
  // Not efficient. But I'm not sure the server is responsible for this anyway.
  while (resources.length) {
    const resourceBeingDeleted = resources.pop();
    const indexOfResourceToDelete = gameState.resources.findIndex(
      (gameResource) => gameResource.type === resourceBeingDeleted.type
    );
    gameState.resources.splice(indexOfResourceToDelete, 1);
  }

  // Delete all events other than the end step
  gameState.availableActions = [playerActions.endStep];
  gameState.reservedFactory = null;

  const response = {
    playedCard,
    cardsInPlay: gameState.cardsInPlay,
    reservedFactory: gameState.reservedFactory,
    availableActions: gameState.availableActions,
    resources: gameState.resources,
  };
  return {
    response,
  };
}

/**
 * Puts a card from the available worker pool into the employees of a user.
 * Returns the function to update the client game state
 */
export function hireWorker(
  gameState: GameState,
  worker: Employee,
  resources: Array<Resource>
): ServerResponse {
  const employeeIndex = gameState.availableEmployees.findIndex(
    (availableWorker) => availableWorker.name === worker.name
  );
  const hiredEmployee = gameState.availableEmployees.splice(employeeIndex, 1);
  gameState.employees.push(...hiredEmployee);

  // Unreserve cards and put them in the discard
  // The order shouldn't matter - they're unknown to all.
  const usedGoods = gameState.reservedCards.splice(0, resources.length);
  gameState.cardsInDiscard.push(...usedGoods);

  // Find the resources and delete them.
  // Not efficient. But I'm not sure the server is responsible for this anyway.
  while (resources.length) {
    const resourceBeingDeleted = resources.pop();
    const indexOfResourceToDelete = gameState.resources.findIndex(
      (gameResource) => gameResource.type === resourceBeingDeleted.type
    );
    gameState.resources.splice(indexOfResourceToDelete, 1);
  }

  // Delete all events other than the end step
  gameState.availableActions = [playerActions.endStep];

  const response = {
    playedCard: hiredEmployee,
    employees: gameState.employees,
    availableActions: gameState.availableActions,
    availableEmployees: gameState.availableEmployees,
    resources: gameState.resources,
  };
  return {
    response,
  };
}

export function unassignWorker(
  gameState: GameState,
  worker: AssignedEmployee,
  resources: Array<Resource>
): ServerResponse {
  const employeeIndex = gameState.assignedEmployees.findIndex(
    (assignedWorker) => assignedWorker.name === worker.name
  );
  gameState.assignedEmployees.splice(employeeIndex, 1);

  // Unreserve cards and put them in the discard
  // The order shouldn't matter - they're unknown to all.
  const usedGoods = gameState.reservedCards.splice(0, resources.length);
  gameState.cardsInDiscard.push(...usedGoods);

  // Find the resources and delete them.
  // Not efficient. But I'm not sure the server is responsible for this anyway.
  while (resources.length) {
    const resourceBeingDeleted = resources.pop();
    const indexOfResourceToDelete = gameState.resources.findIndex(
      (gameResource) => gameResource.type === resourceBeingDeleted.type
    );
    gameState.resources.splice(indexOfResourceToDelete, 1);
  }

  // Delete all events other than the end step
  gameState.availableActions = [playerActions.endStep];

  const response = {
    assignedEmployees: gameState.assignedEmployees,
    availableActions: gameState.availableActions,
    resources: gameState.resources,
  };
  return {
    response,
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
  const coalMines = [coalMineWheat, coalMineBrick, coalMineMetal, coalMineWool];
  const chosenCoalMine = coalMines[Math.floor(Math.random() * 4)];
  game.cardsInPlay.push(chosenCoalMine, glassblower);
  game.cardsInHand.push(office, tannery);
  game.resources.push(bread, leather, bread, bread, leather, coal);
  game.cardsInDeck.push(...generateTestCards());
  game.players.push({
    name: "test-player",
  });
  game.availableEmployees = [skilledApprentice, apprentice, master];
  game.employees = [boss, master];
  game.availableActions = [playerActions.endStep];
  return;
}

/**
 * Returns valid actions that can be performed, which is drawing 3 cards.
 * After drawing, the user is allowed to discard 2 cards as well, but that's appended after completing the drawing.
 */
function startRound(gameState: GameState): ServerResponse {
  gameState.availableActions = [
    playerActions.discardCard,
    playerActions.endStep,
  ];
  gameState.marketCards = [];
  return {
    response: {
      availableActions: gameState.availableActions,
    },
  };
}

/**
 * Returns valid actions that can be performed, which is drawing 3 cards.
 * After drawing, the user is allowed to discard 2 cards as well, but that's appended after completing the drawing.
 */
function draw(gameState: GameState): ServerResponse {
  const drawCardCount =
    2 +
    sum(
      gameState.cardsInPlay.map((card) => card.boostDrawCount).filter(Boolean)
    );
  const drawCardActions = new Array(drawCardCount).fill(playerActions.drawCard);
  gameState.availableActions = [...drawCardActions, playerActions.endStep];
  return {
    response: {
      availableActions: gameState.availableActions,
    },
  };
}

/**
 * Initiate the assignment step in the round
 * The returns valid actions that can be performed specific for this round.
 */
function assignEmployees(gameState: GameState): ServerResponse {
  gameState.availableActions = [
    playerActions.assignEmployee,
    playerActions.reserveFactory,
    playerActions.endStep,
  ];
  return {
    response: {
      availableActions: gameState.availableActions,
    },
  };
}

export function reserveFactory(gameState: GameState, factory: Card) {
  const cardIndex = gameState.cardsInHand.findIndex(
    (cardInHand) => cardInHand.name === factory.name
  );
  gameState.cardsInHand.splice(cardIndex, 1);

  gameState.reservedFactory = factory;

  // Originally a client side util, but the whole local server here will likely be disposed/refactored once porting into NativeScript.
  removeActionFromAvailableActions(gameState, PlayerActionEnum.reserveFactory);
  return {
    response: {
      reservedFactory: gameState.reservedFactory,
      cardsInHand: gameState.cardsInHand,
      availableActions: gameState.availableActions,
    },
  };
}

/**
 * Initiate the assignment step in the round
 * The returns valid actions that can be performed specific for this round.
 */
export function assignEmployee(
  gameState: GameState,
  employee: Employee,
  mode: ProductionEfficiency,
  factory: Card
): ServerResponse {
  // Validate action
  console.warn("No validation of assignment");

  // create assignment
  const assignedEmployee: AssignedEmployee = {
    assignment: factory,
    name: employee.name,
    mode,
    unassignmentCost: employee.unassignmentCost,
  };
  gameState.assignedEmployees.push(assignedEmployee);
  return {
    response: {
      assignedEmployees: gameState.assignedEmployees,
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
function produce(gameState: GameState): ServerResponse {
  gameState.availableActions = [
    playerActions.produceAtFactory,
    playerActions.endStep,
  ];
  return {
    response: {
      availableActions: gameState.availableActions,
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
function purchase(gameState: GameState): ServerResponse {
  gameState.availableActions = [
    playerActions.hireWorker,
    playerActions.unassignEmployee,
    playerActions.buildFactory,
    playerActions.endStep,
  ];
  return {
    response: {
      availableActions: gameState.availableActions,
    },
  };
}

/**
 * Initiate the final step in the round
 * Check if there is a game end condition (if a player has 8 buildings), and tot up the scores.
 * Returns the valid actions that can be performed for this round.
 * Either acknowledge and a return to the startRound action, or nothing, meaning the game has ended and all they can do is leave.
 */
function endRound(gameState: GameState): ServerResponse {
  const isGameEnd = gameState.isGameEnding; // if marked as game ending last round, mark as finished here.
  gameState.isGameEnding = gameState.cardsInPlay.length >= 4;
  gameState.availableActions = isGameEnd ? [] : [playerActions.endStep];
  gameState.winner = isGameEnd ? gameState.players[0] : null;
  gameState.score = sum([
    ...gameState.resources.map((resource) => resource.value),
    ...gameState.cardsInPlay.map((card) => card.cost),
  ]);

  console.log("current score: ", gameState.score);

  // Reset worker production states
  gameState.assignedEmployees = gameState.assignedEmployees.map((employee) => ({
    ...employee,
    hasProduced: false,
  }));

  // If at the end of the game, assign investors for free.
  const assignedFactories = gameState.assignedEmployees.map(
    (employee) => employee.assignment.name
  );
  const unassignedFactories = gameState.cardsInPlay.filter(
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
  gameState.assignedEmployees.push(...investorAssignments);

  // Discard the market
  gameState.cardsInDiscard.push(...gameState.marketCards);
  gameState.marketCards = [];

  return {
    response: {
      assignedEmployees: gameState.assignedEmployees,
      availableActions: gameState.availableActions,
      winner: gameState.winner,
    },
  };
}
