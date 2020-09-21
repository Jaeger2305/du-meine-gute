import { GameState, Card, Employee, Resource } from "../types";
import { wood, brick, wheat, stone } from "../resources";
import { playerActions } from "../game";
import { coalMine, bakery, tannery } from "../game/cards";

type ServerResponse = {
  response: any;
};

/**
 * I don't remember what this was for
 */
function gameReady() {}

export const roundSteps: Array<(gameState: GameState) => ServerResponse> = [
  startRound,
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
  // should be connected to deck, and stop drawing after picking 3 suns.
  gameState.availableActions = [playerActions.endStep];
  const baseResources = [brick, stone, wheat, wood];
  const marketResources = [...new Array(10)].map(
    (v) => baseResources[Math.floor(Math.random() * baseResources.length)]
  );
  gameState.marketResources.push(...marketResources);
  return {
    response: {
      availableActions: gameState.availableActions,
      marketResources: gameState.marketResources,
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

/**
 * Puts a card from a players hand into play.
 * Returns the function to update the client game state
 */
export function playCard(
  gameState: GameState,
  card: Card,
  resources: Array<Resource>
): ServerResponse {
  if (!gameState.cardsInDeck.length) {
    gameState.cardsInDeck = gameState.cardsInDiscard.slice().reverse();
    gameState.cardsInDiscard = [];
  }
  const cardIndex = gameState.cardsInHand.findIndex(
    (cardInHand) => cardInHand.name === card.name
  );
  const playedCard = gameState.cardsInHand.splice(cardIndex, 1);
  gameState.cardsInPlay.splice(0, 0, ...playedCard);

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
    playedCard,
    cardsInPlay: gameState.cardsInPlay,
    cardsInHand: gameState.cardsInHand,
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
  return [bakery, tannery];
}

/**
 * Initialises the deck of cards
 * Returns valid actions that can be performed, which is just acknowledgements
 */
export function setupGame(game: GameState): void {
  game.cardsInPlay.push(coalMine);
  game.cardsInDeck.push(...generateTestCards());
  game.players.push({
    name: "test-player",
  });
  game.employees = [
    {
      name: "test-employee-1",
      modes: [
        {
          productionCount: 1,
          resourceSparingCount: 0,
        },
      ],
      cost: 0,
    },
  ];
  game.availableActions = [playerActions.endStep];
  return;
}

/**
 * Returns valid actions that can be performed, which is drawing 3 cards.
 * After drawing, the user is allowed to discard 2 cards as well, but that's appended after completing the drawing.
 */
function startRound(gameState: GameState): ServerResponse {
  gameState.availableActions = [playerActions.drawCard, playerActions.endStep];
  gameState.marketResources = [];
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
    playerActions.endStep,
  ];
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
export function assignEmployee(
  gameState: GameState,
  employee: Employee,
  factory: Card
): ServerResponse {
  gameState.availableActions = [];
  gameState.assignedEmployees = [
    {
      assignment: factory,
      name: employee.name,
      mode: { productionCount: 1, resourceSparingCount: 0 },
    },
  ];
  return {
    response: {
      availableActions: gameState.availableActions,
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
  const isGameEnd = gameState.cardsInPlay.length >= 3;
  gameState.availableActions = isGameEnd ? [] : [playerActions.endStep];
  gameState.winner = isGameEnd ? gameState.players[0] : null;

  return {
    response: {
      availableActions: gameState.availableActions,
      winner: gameState.winner,
    },
  };
}
