"use strict";
exports.__esModule = true;
exports.payForFactory = void 0;
var __1 = require("..");
var utils_1 = require("../utils");
/**
 * Puts a card from a players hand into play.
 * Returns the function to update the client game state
 */
function payForFactory(_a, _b, resourcePayment) {
    var reservedCards = _a.reservedCards, cardsInDiscard = _a.cardsInDiscard;
    var reservedFactory = _b.reservedFactory, cardsInPlay = _b.cardsInPlay, resources = _b.resources, availableActions = _b.availableActions;
    cardsInPlay.push(reservedFactory);
    utils_1.spendResources(reservedCards, cardsInDiscard, resources, resourcePayment);
    // Delete all events other than the end step
    availableActions.splice(0, availableActions.length, __1.playerActions.endStep);
}
exports.payForFactory = payForFactory;
//# sourceMappingURL=build-factory-utils.js.map