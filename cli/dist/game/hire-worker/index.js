"use strict";
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
exports.__esModule = true;
exports.hireWorker = void 0;
var prompts = require("prompts");
var types_1 = require("../../types");
var utils_1 = require("../utils");
var hire_worker_1 = require("../../local-server/actions/hire-worker");
var hire_worker_utils_1 = require("./hire-worker-utils");
function hireWorker(gameState, playerState) {
    return __awaiter(this, void 0, void 0, function () {
        var affordableCards, factoryTypesInPlay, availableCards, cardChoice, resourcesChoice;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    affordableCards = utils_1.filterCardsToAffordable(gameState.availableEmployees, function (card) { return card.cost; }, playerState.resources);
                    factoryTypesInPlay = playerState.cardsInPlay.map(function (factory) { return factory.resource; });
                    availableCards = affordableCards.filter(function (card) {
                        return !utils_1.differenceResources(card.resourceSpecialty, factoryTypesInPlay).length;
                    });
                    // Short circuit if nothing found
                    if (!availableCards.length)
                        return [2 /*return*/, utils_1.removeActionFromAvailableActions(playerState, types_1.PlayerActionEnum.hireWorker)];
                    return [4 /*yield*/, prompts({
                            type: "select",
                            message: "pick an card to play",
                            name: "card",
                            choices: availableCards.map(function (card) { return ({
                                title: card.name,
                                value: card
                            }); })
                        })];
                case 1:
                    cardChoice = _a.sent();
                    // Short circuit if aborted
                    if (!cardChoice)
                        return [2 /*return*/];
                    return [4 /*yield*/, prompts({
                            type: "multiselect",
                            message: "pick resources to spend",
                            name: "resources",
                            choices: playerState.resources
                                .map(function (resource) { return ({
                                title: resource.type + " - " + resource.value,
                                value: resource
                            }); })
                                .filter(function (resource) { return resource.value; })
                        })];
                case 2:
                    resourcesChoice = _a.sent();
                    // Verify resources are not under or wasted
                    if (!utils_1.verifyResources(resourcesChoice.resources, cardChoice.card.cost))
                        return [2 /*return*/];
                    // Notify server
                    hire_worker_1.hireWorker(gameState, playerState, cardChoice.card, resourcesChoice.resources);
                    // Optimistically update
                    hire_worker_utils_1.payForWorker(gameState, playerState, cardChoice.card, resourcesChoice.resources);
                    return [2 /*return*/];
            }
        });
    });
}
exports.hireWorker = hireWorker;
//# sourceMappingURL=index.js.map