import { playerActions } from "..";
import { GameState, PlayerState, Resource } from "../../types";
import { spendResources } from "../utils";

/**
 * Puts a card from a players hand into play.
 * Returns the function to update the client game state
 */
export function payForFactory(
  { reservedCards, cardsInDiscard }: GameState,
  { reservedFactory, cardsInPlay, resources, availableActions }: PlayerState,
  resourcePayment: Array<Resource>
): void {
  cardsInPlay.push(reservedFactory);

  spendResources(reservedCards, cardsInDiscard, resources, resourcePayment);

  // Delete all events other than the end step
  availableActions.splice(0, availableActions.length, playerActions.endStep);
}
