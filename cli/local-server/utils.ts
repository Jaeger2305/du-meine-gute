import {
  bakery,
  tannery,
  altBakery,
  sawmill,
  bakeryWithChain,
  altTannery,
} from "../game/cards";
import { Card } from "../types";

/**
 *
 */
export function generateTestCards(): Array<Card> {
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
