import { cardRecords } from "../../../cli/game/cards";
import { Card } from "../../../cli/types";

/**
 *
 */
export function generateTestCards(): Array<Card> {
  return Object.values(cardRecords);
}
