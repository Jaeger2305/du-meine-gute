"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.differenceResources = exports.drawFromDeck = exports.spendResources = exports.verifyResources = exports.removeActionFromAvailableActions = exports.filterCardsToAffordable = void 0;
var lodash_1 = require("lodash");
function filterCardsToAffordable(cards, costExtractor, resources) {
    // tot up resources
    var money = lodash_1.sumBy(resources, "value");
    // filter cards to those costing less than resource total
    return cards.filter(function (card) { return costExtractor(card) <= money; });
}
exports.filterCardsToAffordable = filterCardsToAffordable;
function removeActionFromAvailableActions(_a, actionToRemove) {
    var availableActions = _a.availableActions;
    var index = availableActions.findIndex(function (action) { return action.type === actionToRemove; });
    if (index === -1)
        throw new Error("the build factory action wasn't available, but this shouldn't be possible yet.");
    availableActions.splice(index, 1);
    return;
}
exports.removeActionFromAvailableActions = removeActionFromAvailableActions;
function verifyResources(resources, costOfPurchase) {
    if (!resources.length)
        return false;
    if (resources.find(function (resource) { return resource.value === 0; }))
        return false;
    var selectionValue = lodash_1.sumBy(resources, "value");
    var isAffordable = selectionValue >= costOfPurchase;
    var cheapestResource = lodash_1.sortBy(resources, "value")[0];
    var isExcessive = selectionValue - cheapestResource.value >= costOfPurchase;
    return isAffordable && !isExcessive;
}
exports.verifyResources = verifyResources;
function spendResources(reservedCards, cardsInDiscard, resources, resourcePayment) {
    if (resourcePayment.length > reservedCards.length)
        throw new Error("not enough cards reserved for resource selection");
    var resourcesAfterPayment = differenceResources(resources, resourcePayment);
    var isSufficientResources = resources.length - resourcesAfterPayment.length === resourcePayment.length;
    if (!isSufficientResources)
        throw new Error("not enough resources for the payment");
    var usedResources = reservedCards.splice(0, resourcePayment.length);
    cardsInDiscard.push.apply(cardsInDiscard, usedResources);
    resources.splice.apply(resources, __spreadArrays([0, resources.length], resourcesAfterPayment));
}
exports.spendResources = spendResources;
function shuffleDiscard(cardsInDeck, cardsInDiscard) {
    if (cardsInDeck.length) {
        throw new Error("The deck is expected to be empty");
    }
    return lodash_1.shuffle(cardsInDiscard);
}
function drawFromDeck(cardsInDeck, cardsInDiscard) {
    if (!cardsInDeck.length && cardsInDiscard.length) {
        var shuffledDiscard = shuffleDiscard(cardsInDeck, cardsInDiscard);
        cardsInDeck.splice.apply(cardsInDeck, __spreadArrays([0, cardsInDeck.length], shuffledDiscard));
        cardsInDiscard.splice(0, cardsInDiscard.length);
    }
    else if (!cardsInDeck.length) {
        return null;
    }
    var drawnCards = cardsInDeck.splice(0, 1);
    return drawnCards[0];
}
exports.drawFromDeck = drawFromDeck;
/**
 * Lodash's difference creates a unique array, which isn't always desired.
 * So, roll a custom implementation that does a true difference.
 * Simplest to use a for loop filter, but this isn't particularly optimised for efficiency or readability, just speed of code.
 * @param originalResources
 * @param resourcesToRemove
 */
function differenceResources(originalResources, resourcesToRemove) {
    // [1,2,2,3,5], [2,4] -> [1,2,3,5]
    var copyOriginalResources = originalResources.slice();
    resourcesToRemove.forEach(function (resource) {
        var indexToDelete = copyOriginalResources.findIndex(function (originalResource) { return originalResource.type === resource.type; });
        if (indexToDelete > -1)
            copyOriginalResources.splice(indexToDelete, 1);
    });
    return copyOriginalResources;
}
exports.differenceResources = differenceResources;
//# sourceMappingURL=index.js.map