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
exports.produceAtFactory = void 0;
var prompts = require("prompts");
var types_1 = require("../../types");
var resources_1 = require("../../resources");
var utils_1 = require("../utils");
var production_utils_1 = require("./production-utils");
function produceAtFactory(gameState, playerState) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var readyWorkers, factoryChoice, marketResources, canProduce, hasProduced, _loop_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    readyWorkers = playerState.assignedEmployees
                        .map(function (factoryWorker, index) { return (__assign(__assign({}, factoryWorker), { index: index })); })
                        .filter(function (employee) { return !employee.hasProduced; });
                    return [4 /*yield*/, prompts({
                            type: "select",
                            message: "pick an assigned worker",
                            name: "factoryWorker",
                            choices: readyWorkers.map(function (factoryWorker) { return ({
                                title: factoryWorker.name,
                                value: factoryWorker
                            }); })
                        })];
                case 1:
                    factoryChoice = _c.sent();
                    marketResources = __spreadArrays(gameState.marketCards.map(function (card) { return card.resource; }), playerState.cardsInPlay
                        .flatMap(function (card) { return card.marketBoost; })
                        .filter(Boolean));
                    canProduce = true;
                    hasProduced = false;
                    _loop_1 = function () {
                        var inputResources, canUseMarketResources, _a, isEnoughToProduce, requiredExtraResources, _b, fallbackSuccess, cardIndexesToDelete, resourceIndex, chainProductionCount, producedResources;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    inputResources = hasProduced &&
                                        factoryChoice.factoryWorker.assignment.productionConfig.chainInput
                                        ? __spreadArrays(factoryChoice.factoryWorker.assignment.productionConfig
                                            .chainInput) : __spreadArrays(factoryChoice.factoryWorker.assignment.productionConfig.input);
                                    inputResources.sort(function (a) { return (a.type === resources_1.ResourceType.placeholder ? 1 : -1); }); // Move placeholders to the end of the array. Functionally splitting this is probably cleaner, but slightly more complex.
                                    canUseMarketResources = !hasProduced;
                                    _a = production_utils_1.checkOutstandingResources(inputResources, // should toggle based on has produced
                                    canUseMarketResources ? marketResources : [], // the market can only be used for initial production
                                    hasProduced
                                        ? 0 // the discount applies only to the first production
                                        : factoryChoice.factoryWorker.mode.resourceSparingCount), isEnoughToProduce = _a.isEnoughToProduce, requiredExtraResources = _a.requiredExtraResources;
                                    if (!isEnoughToProduce) return [3 /*break*/, 1];
                                    canProduce = true;
                                    return [3 /*break*/, 3];
                                case 1: return [4 /*yield*/, production_utils_1.fallbackProduction(requiredExtraResources, playerState.cardsInHand, canUseMarketResources ? marketResources : [], factoryChoice.factoryWorker)];
                                case 2:
                                    _b = _c.sent(), fallbackSuccess = _b.fallbackSuccess, cardIndexesToDelete = _b.cardIndexesToDelete;
                                    cardIndexesToDelete.forEach(function (cardIndexToDelete) {
                                        gameState.cardsInDiscard.push(playerState.cardsInHand[cardIndexToDelete]);
                                        playerState.cardsInHand.splice(cardIndexToDelete, 1);
                                    }); // it's not nice to mutate the game state here.
                                    canProduce = fallbackSuccess;
                                    _c.label = 3;
                                case 3:
                                    // Produce the resource
                                    if (canProduce) {
                                        // Remove the market used resources
                                        while (inputResources.length) {
                                            resourceIndex = marketResources.findIndex(function (resource) {
                                                return inputResources[0].type === resource.type ||
                                                    inputResources[0].type === resources_1.ResourceType.placeholder;
                                            } // If it's a placeholder, use whatever is in the market. This requires placeholders to be at the end, sorted earlier.
                                            );
                                            inputResources.shift();
                                            // This breaks with multi players
                                            if (resourceIndex > -1)
                                                gameState.marketCards.splice(resourceIndex, 1); // it might not be found in case this was spared because the worker was efficient.
                                        }
                                        chainProductionCount = (_b = (_a = factoryChoice.factoryWorker.assignment.productionConfig.chainInput) === null || _a === void 0 ? void 0 : _a.filter(function (resource) { return !resource.baseResource; }).length) !== null && _b !== void 0 ? _b : 1;
                                        producedResources = new Array(hasProduced
                                            ? chainProductionCount
                                            : factoryChoice.factoryWorker.mode.productionCount)
                                            .fill(factoryChoice.factoryWorker.assignment.productionConfig.output)
                                            .flat();
                                        // Draw card from deck to represent the resource
                                        producedResources.forEach(function (resource) {
                                            return production_utils_1.produceGood(gameState, playerState, resource);
                                        });
                                        // If the assignment allows only one production and no chaining, production can no longer happen.
                                        if (!factoryChoice.factoryWorker.assignment.productionConfig.chainInput)
                                            canProduce = false;
                                        hasProduced = true;
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _c.label = 2;
                case 2:
                    if (!canProduce) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1()];
                case 3:
                    _c.sent();
                    return [3 /*break*/, 2];
                case 4:
                    // Indicate the worker has produced this round.
                    playerState.assignedEmployees[factoryChoice.factoryWorker.index].hasProduced = true;
                    // Remove the assigned worker if free to do so
                    if (factoryChoice.factoryWorker.unassignmentCost === 0) {
                        playerState.assignedEmployees.splice(factoryChoice.factoryWorker.index, 1);
                    }
                    // if there are no more workers to produce at, remove the available step
                    if (!playerState.assignedEmployees.filter(function (employee) { return !employee.hasProduced; })
                        .length) {
                        utils_1.removeActionFromAvailableActions(playerState, types_1.PlayerActionEnum.produceAtFactory);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.produceAtFactory = produceAtFactory;
//# sourceMappingURL=index.js.map