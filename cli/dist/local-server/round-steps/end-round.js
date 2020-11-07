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
exports.__esModule = true;
exports.endRound = void 0;
var lodash_1 = require("lodash");
var game_1 = require("../../game");
/**
 * Initiate the final step in the round
 * Check if there is a game end condition (if a player has 8 buildings), and tot up the scores.
 * Returns the valid actions that can be performed for this round.
 * Either acknowledge and a return to the startRound action, or nothing, meaning the game has ended and all they can do is leave.
 */
function endRound(gameState, playerState) {
    var _a, _b;
    var isGameEnd = gameState.isGameEnding; // if marked as game ending last round, mark as finished here.
    gameState.isGameEnding =
        playerState.cardsInPlay.length >= gameState.config.buildCountForEndGame;
    playerState.availableActions = isGameEnd ? [] : [game_1.playerActions.endStep];
    gameState.winner = isGameEnd ? playerState.player : null;
    var resourcesScore = Math.floor(lodash_1.sum(playerState.resources.map(function (resource) { return resource.value; })) *
        gameState.config.pointsPerResource);
    var factoryScore = lodash_1.sum(playerState.cardsInPlay.map(function (card) { return card.points; }));
    var employeeScore = lodash_1.sum(playerState.employees.map(function (employee) { return employee.points; }));
    playerState.score = lodash_1.sum([resourcesScore, factoryScore, employeeScore]);
    console.log("current score: ", playerState.score);
    // Reset worker production states
    playerState.assignedEmployees = playerState.assignedEmployees.map(function (employee) { return (__assign(__assign({}, employee), { hasProduced: false })); });
    // If at the end of the game, assign investors for free.
    if (gameState.isGameEnding) {
        var assignedFactories_1 = playerState.assignedEmployees.map(function (employee) { return employee.assignment.name; });
        var unassignedFactories = playerState.cardsInPlay.filter(function (card) { return !assignedFactories_1.includes(card.name) && card.productionConfig; });
        var investorAssignments = unassignedFactories.map(function (factory, index) { return ({
            name: "investor " + index + " - " + factory.name + " - " + factory.productionConfig.output.join(),
            mode: { productionCount: 1, resourceSparingCount: 0 },
            unassignmentCost: 0,
            assignment: factory
        }); });
        (_a = playerState.assignedEmployees).push.apply(_a, investorAssignments);
    }
    // Discard the market
    (_b = gameState.cardsInDiscard).push.apply(_b, gameState.marketCards);
    gameState.marketCards = [];
    return {
        response: {
            assignedEmployees: playerState.assignedEmployees,
            availableActions: playerState.availableActions,
            winner: gameState.winner
        }
    };
}
exports.endRound = endRound;
//# sourceMappingURL=end-round.js.map