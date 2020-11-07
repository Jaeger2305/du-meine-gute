"use strict";
exports.__esModule = true;
exports.newGame = exports.playerActions = void 0;
var discard_1 = require("./discard");
var build_factory_1 = require("./build-factory");
var assign_employee_1 = require("./assign-employee");
var reserve_factory_1 = require("./reserve-factory");
var production_1 = require("./production");
var hire_worker_1 = require("./hire-worker");
var unassign_employee_1 = require("./unassign-employee");
var types_1 = require("../types");
var draw_card_1 = require("./draw-card");
var end_step_1 = require("./end-step");
exports.playerActions = {
    endStep: {
        type: types_1.PlayerActionEnum.endStep,
        handler: end_step_1.endStep
    },
    drawCard: {
        type: types_1.PlayerActionEnum.drawCard,
        handler: draw_card_1.drawCard
    },
    discardCard: {
        type: types_1.PlayerActionEnum.discardCard,
        handler: discard_1.discard
    },
    assignEmployee: {
        type: types_1.PlayerActionEnum.assignEmployee,
        handler: assign_employee_1.assignEmployee
    },
    reserveFactory: {
        type: types_1.PlayerActionEnum.reserveFactory,
        handler: reserve_factory_1.reserveFactory
    },
    produceAtFactory: {
        type: types_1.PlayerActionEnum.produceAtFactory,
        handler: production_1.produceAtFactory
    },
    hireWorker: {
        type: types_1.PlayerActionEnum.hireWorker,
        handler: hire_worker_1.hireWorker
    },
    buildFactory: {
        type: types_1.PlayerActionEnum.buildFactory,
        handler: build_factory_1.buildFactory
    },
    unassignEmployee: {
        type: types_1.PlayerActionEnum.unassignEmployee,
        handler: unassign_employee_1.unassignEmployee
    }
};
function newGame() {
    var gameState = {
        config: {
            marketSuns: 1,
            buildCountForEndGame: 4,
            drawCount: 2,
            pointsPerResource: 0.25,
            workerCount: 4
        },
        cardsInDeck: [],
        cardsInDiscard: [],
        winner: null,
        players: [],
        availableEmployees: [],
        reservedCards: [],
        marketCards: [],
        score: 0
    };
    return gameState;
}
exports.newGame = newGame;
//# sourceMappingURL=index.js.map