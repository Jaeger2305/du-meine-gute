"use strict";
exports.__esModule = true;
exports.assignEmployees = void 0;
var game_1 = require("../../game");
/**
 * Initiate the assignment step in the round
 * The returns valid actions that can be performed specific for this round.
 */
function assignEmployees(gameState, playerState) {
    playerState.availableActions = [
        game_1.playerActions.assignEmployee,
        game_1.playerActions.reserveFactory,
        game_1.playerActions.endStep,
    ];
    return {
        response: {
            availableActions: playerState.availableActions
        }
    };
}
exports.assignEmployees = assignEmployees;
//# sourceMappingURL=assign-employees.js.map