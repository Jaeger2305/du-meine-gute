import { shuffle } from "lodash"
import { cardRecords } from "../cards";
import { Card } from "../types";

/**
 *
 */
export function generateTestCards(): Array<Card> {
  return shuffle(Object.values(cardRecords));
}
