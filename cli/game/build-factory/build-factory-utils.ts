import { differenceBy } from "lodash";
import { playerActions } from "..";
import { GameState, PlayerState, Resource } from "../../types";

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

  // Unreserve cards and put them in the discard
  // The order shouldn't matter - they're unknown to all.
  const usedGoods = reservedCards.splice(0, resourcePayment.length);
  cardsInDiscard.push(...usedGoods);

  // Find the resources and delete them.
  resources.splice(
    0,
    resources.length,
    ...differenceBy(resources, resourcePayment, "type")
  );

  // Delete all events other than the end step
  availableActions.splice(0, availableActions.length, playerActions.endStep);
}
