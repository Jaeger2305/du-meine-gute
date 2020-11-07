"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.setupGame = exports.roundSteps = void 0;
var resources_1 = require("../resources");
var game_1 = require("../game");
var cards_1 = require("../game/cards");
var worker_1 = require("../game/worker");
var utils_1 = require("./utils");
var round_steps_1 = require("./round-steps");
__createBinding(exports, round_steps_1, "roundSteps");
/**
 * Initialises the deck of cards
 * Returns valid actions that can be performed, which is just acknowledgements
 */
function setupGame(game) {
    var _a, _b;
    game.reservedCards.push(cards_1.cardRecords.TANNERY_METAL_WOOD, cards_1.cardRecords.GLASSMAKER, cards_1.cardRecords.BAKERY_CLAY, cards_1.cardRecords.SAWMILL_CLAY_METAL, cards_1.cardRecords.MARKET_OFFICE_CLAY1);
    (_a = game.cardsInDeck).push.apply(_a, utils_1.generateTestCards());
    (_b = game.availableEmployees).push.apply(_b, worker_1.seedWorkers(game.config.workerCount));
    var coalMines = [cards_1.coalMineWheat, cards_1.coalMineClay, cards_1.coalMineMetal, cards_1.coalMineWool];
    var chosenCoalMine = coalMines[Math.floor(Math.random() * 4)];
    var players = [
        {
            id: "test-player-id-1",
            playerNumber: 0,
            employees: [worker_1.boss],
            cardsInHand: [
                cards_1.cardRecords.MARKET_OFFICE_CLAY2,
                cards_1.cardRecords.TANNERY_WHEAT_WOOL,
            ],
            cardsInPlay: [chosenCoalMine, cards_1.cardRecords.GLASSMAKER_SUN],
            resources: [resources_1.bread, resources_1.leather, resources_1.bread, resources_1.leather, resources_1.coal],
            availableActions: [game_1.playerActions.endStep],
            assignedEmployees: [],
            reservedFactory: null,
            score: 0,
            player: { name: "test-player-name-1" }
        },
    ];
    game.players = players;
    return;
}
exports.setupGame = setupGame;
//# sourceMappingURL=index.js.map