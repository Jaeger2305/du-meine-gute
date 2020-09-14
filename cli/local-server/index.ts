import { playerActions } from "../game";

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
  assignWorkers,
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
  return {
    response: {
      availableActions: gameState.availableActions,
    },
  };
}

/**
 * Reveals a card from the deck after the user has requested drawing a card.
 * Returns the function to update the client game state
 */
export function drawCard(gameState: GameState): ServerResponse {
  if (!gameState.cardsInDeck.length) {
    gameState.cardsInDeck = gameState.cardsInDiscard.slice().reverse();
    gameState.cardsInDiscard = [];
  }
  const drawnCard = gameState.cardsInDeck.splice(0, 1);
  gameState.cardsInHand.splice(0, 0, ...drawnCard);
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
export function playCard(gameState: GameState, card: Card): ServerResponse {
  if (!gameState.cardsInDeck.length) {
    gameState.cardsInDeck = gameState.cardsInDiscard.slice().reverse();
    gameState.cardsInDiscard = [];
  }
  const cardIndex = gameState.cardsInHand.findIndex(
    (cardInHand) => cardInHand.name === card.name
  );
  const playedCard = gameState.cardsInHand.splice(cardIndex, 1);
  gameState.cardsInPlay.splice(0, 0, ...playedCard);
  gameState.availableActions = []; // end step after single card played
  const response = {
    playedCard,
    cardsInPlay: gameState.cardsInPlay,
    cardsInHand: gameState.cardsInHand,
    availableActions: gameState.availableActions,
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
    { type: "test", name: "test1" },
    { type: "test", name: "test2" },
    { type: "test", name: "test3" },
    { type: "test", name: "test4" },
    { type: "test", name: "test5" },
    { type: "test", name: "test6" },
    { type: "test", name: "test7" },
    { type: "test", name: "test8" },
  ];
}

/**
 * Initialises the deck of cards
 * Returns valid actions that can be performed, which is just acknowledgements
 */
export function setupGame(game: GameState): void {
  game.cardsInDeck.push(...generateTestCards());
  game.players.push({
    name: "test-player",
  });
  game.availableActions = [playerActions.endStep];
  return;
}

/**
 * Returns valid actions that can be performed, which is drawing 3 cards.
 * After drawing, the user is allowed to discard 2 cards as well, but that's appended after completing the drawing.
 */
function startRound(gameState: GameState): ServerResponse {
  gameState.availableActions = [playerActions.drawCard, playerActions.endStep];
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
function assignWorkers(gameState: GameState): ServerResponse {
  gameState.availableActions = [playerActions.endStep];
  return {
    response: {
      availableActions: gameState.availableActions,
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
    playerActions.useMarketCard,
    playerActions.useResource,
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
  const isGameEnd = gameState.cardsInPlay.length >= 1;
  gameState.availableActions = isGameEnd ? [] : [playerActions.endStep];
  gameState.winner = isGameEnd ? gameState.players[0] : null;

  return {
    response: {
      availableActions: gameState.availableActions,
      winner: gameState.winner,
    },
  };
}
