"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.produceGood = exports.fallbackProduction = exports.checkOutstandingResources = void 0;
var lodash_1 = require("lodash");
var prompts = require("prompts");
var resources_1 = require("../../resources");
var resources_2 = require("../../resources");
var utils_1 = require("../utils");
function checkOutstandingResources(requiredResources, inputResources, resourceSparingCount) {
    // Check the secondary resources are sufficient
    var inputSecondaryResources = inputResources.filter(function (resource) { return !resource.baseResource; });
    var requiredSecondaryResources = requiredResources.filter(function (resource) { return !resource.baseResource; });
    var extraRequiredSecondaryResources = utils_1.differenceResources(requiredSecondaryResources, inputSecondaryResources);
    // Check the known base resources are sufficient
    var inputKnownBaseResources = inputResources.filter(function (resource) {
        return resource.baseResource && resource.type !== resources_2.ResourceType.placeholder;
    });
    var requiredKnownBaseResources = requiredResources.filter(function (resource) {
        return resource.baseResource && resource.type !== resources_2.ResourceType.placeholder;
    });
    var extraRequiredKnownBaseResources = utils_1.differenceResources(requiredKnownBaseResources, inputKnownBaseResources);
    // Check capacity for placeholders
    // const inputPlaceholders = new Array(resourceSparingCount).fill(placeholder)
    var requiredPlaceholders = requiredResources.filter(function (resource) {
        return resource.baseResource && resource.type === resources_2.ResourceType.placeholder;
    });
    // if extra inputKnownBaseResources are left over, they can fill the place holder requirement
    var extraInputUnknownBaseResources = utils_1.differenceResources(inputKnownBaseResources, requiredKnownBaseResources);
    var extraRequiredUnknownBaseResources = new Array(Math.max(0, requiredPlaceholders.length - extraInputUnknownBaseResources.length)).fill(resources_1.placeholder);
    // Apply the resource sparing count to just the base resources, favouring the known resources for discount.
    var extraRequiredBaseResources = __spreadArrays(extraRequiredUnknownBaseResources, extraRequiredKnownBaseResources);
    var requiredExtraResources = __spreadArrays(extraRequiredSecondaryResources, extraRequiredBaseResources);
    var discountAppliedRequiredExtraResources = __spreadArrays(extraRequiredSecondaryResources, extraRequiredBaseResources.slice(0, resourceSparingCount
        ? -resourceSparingCount
        : extraRequiredBaseResources.length));
    var exactSecondaryResources = extraRequiredSecondaryResources.length === 0 &&
        inputSecondaryResources.length === requiredSecondaryResources.length;
    var exactBaseResources = discountAppliedRequiredExtraResources.length ===
        inputKnownBaseResources.length -
            requiredKnownBaseResources.length -
            requiredPlaceholders.length +
            resourceSparingCount;
    var isExactToProduce = exactSecondaryResources && exactBaseResources;
    return {
        isEnoughToProduce: !discountAppliedRequiredExtraResources.length,
        isExactToProduce: isExactToProduce,
        requiredExtraResources: requiredExtraResources
    };
}
exports.checkOutstandingResources = checkOutstandingResources;
function fallbackProduction(requiredExtraResources, cardsInHand, marketResources, assignedEmployee) {
    return __awaiter(this, void 0, void 0, function () {
        var resourcesInHand, intersectingCardsInHand, isEnoughToProduceIncludingHand, requiredExtraResourceTypes, allRelevantCardsInHand, choice, _a, isEnoughToProduceIncludingDiscardSelection, isExactToProduceIncludingDiscardSelection, cardIndexesToDelete;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    resourcesInHand = cardsInHand.map(function (card) { return card.resource; });
                    intersectingCardsInHand = lodash_1.intersection(resourcesInHand, requiredExtraResources);
                    isEnoughToProduceIncludingHand = checkOutstandingResources(assignedEmployee.assignment.productionConfig.input, __spreadArrays(marketResources, resourcesInHand), assignedEmployee.mode.resourceSparingCount).isEnoughToProduce;
                    if (!isEnoughToProduceIncludingHand) {
                        console.log("not enough cards in hand", intersectingCardsInHand, cardsInHand, requiredExtraResources);
                        return [2 /*return*/, { fallbackSuccess: false, cardIndexesToDelete: [] }];
                    }
                    requiredExtraResourceTypes = requiredExtraResources.map(function (r) { return r.type; });
                    allRelevantCardsInHand = cardsInHand
                        .map(function (card, originalIndex) { return (__assign(__assign({}, card), { originalIndex: originalIndex })); })
                        .filter(function (card) {
                        return requiredExtraResourceTypes.includes(card.resource.type) ||
                            requiredExtraResourceTypes.includes(resources_2.ResourceType.placeholder);
                    });
                    if (!allRelevantCardsInHand.length) {
                        console.info("no cards to discard");
                        return [2 /*return*/, { fallbackSuccess: false, cardIndexesToDelete: [] }];
                    }
                    return [4 /*yield*/, prompts({
                            type: "multiselect",
                            message: "pick the card(s) to discard for their resources",
                            name: "cards",
                            choices: allRelevantCardsInHand.map(function (card, index) { return ({
                                title: card.name,
                                value: __assign(__assign({}, card), { originalIndex: index })
                            }); })
                        })];
                case 1:
                    choice = _b.sent();
                    if (!choice) {
                        console.info("no choice made, skipping");
                        return [2 /*return*/, { fallbackSuccess: false, cardIndexesToDelete: [] }];
                    }
                    _a = checkOutstandingResources(assignedEmployee.assignment.productionConfig.input, __spreadArrays(marketResources, choice.cards.map(function (card) { return card.resource; })), assignedEmployee.mode.resourceSparingCount), isEnoughToProduceIncludingDiscardSelection = _a.isEnoughToProduce, isExactToProduceIncludingDiscardSelection = _a.isExactToProduce;
                    if (!isExactToProduceIncludingDiscardSelection) {
                        console.error("too many cards chosen to discard");
                        return [2 /*return*/, { fallbackSuccess: false, cardIndexesToDelete: [] }];
                    }
                    // validate the choice isn't too little
                    if (!isEnoughToProduceIncludingDiscardSelection) {
                        console.error("invalid selection - not enough chosen");
                        return [2 /*return*/, { fallbackSuccess: false, cardIndexesToDelete: [] }];
                    }
                    cardIndexesToDelete = choice.cards
                        .map(function (card) { return card.originalIndex; })
                        .sort()
                        .reverse();
                    return [2 /*return*/, { fallbackSuccess: true, cardIndexesToDelete: cardIndexesToDelete }];
            }
        });
    });
}
exports.fallbackProduction = fallbackProduction;
function produceGood(_a, _b, resource) {
    var cardsInDeck = _a.cardsInDeck, cardsInDiscard = _a.cardsInDiscard, reservedCards = _a.reservedCards;
    var resources = _b.resources;
    // If there are no cards to draw from, shuffle the discard.
    if (!cardsInDeck.length) {
        cardsInDeck.push.apply(cardsInDeck, cardsInDiscard.splice(0, cardsInDiscard.length).reverse());
    }
    // Draw the card into the reserved card space
    var drawnCard = utils_1.drawFromDeck(cardsInDeck, cardsInDiscard);
    if (drawnCard) {
        reservedCards.push(drawnCard);
        resources.push(resource);
    }
}
exports.produceGood = produceGood;
//# sourceMappingURL=production-utils.js.map