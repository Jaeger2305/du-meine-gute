type PlayerAction = {
  type: string;
  handler: (...rest: any) => any;
};

type Card = {
  type: string;
  name: string;
};

type Player = {
  name: string;
};

type GameState = {
  cardsInHand: Array<Card>;
  cardsInDeck: Array<Card>;
  cardsInDiscard: Array<Card>;
  cardsInPlay: Array<Card>;
  winner: Player | null;
  players: Array<Player>;
  availableActions: Array<PlayerAction>;
};
