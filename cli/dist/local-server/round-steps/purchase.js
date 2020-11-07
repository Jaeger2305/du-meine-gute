"use strict";
exports.__esModule = true;
exports.purchase = void 0;
var game_1 = require("../../game");
/**
 * Initiate the purchase step in the round
 * Starting production requires having access to the resource required for its production
 * If the primary worker, one resource can be omitted, but it means only 1 good is produced.
 * This is decided during the assign workers phase.
 *
 * Returns the valid actions that can be performed specific for this round.
 * This could include hiring a worker, building a factory, or skipping
 */
function purchase(gameState, playerState) {
    playerState.availableActions = [
        game_1.playerActions.hireWorker,
        game_1.playerActions.unassignEmployee,
        game_1.playerActions.buildFactory,
        game_1.playerActions.endStep,
    ];
    return {
        response: {
            availableActions: playerState.availableActions
        }
    };
}
exports.purchase = purchase;
//# sourceMappingURL=purchase.js.map