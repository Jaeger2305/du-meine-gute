import { cardRecords } from "../cards";
import { Card } from "../types";

/**
 *
 */
export function generateTestCards(): Array<Card> {
  return Object.values(cardRecords);
}
