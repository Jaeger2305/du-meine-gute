"use strict";
exports.__esModule = true;
exports.produce = void 0;
var game_1 = require("../../game");
/**
 * Initiate the production step in the round
 * Pick one of the assigned workers to produce at that factory.
 * Starting production requires having access to the resource required for its production
 * If the primary worker, one resource can be omitted, but it means only 1 good is produced.
 * This is decided during the assign workers phase.
 *
 * Returns the valid actions that can be performed specific for this round.
 * This includes
 *  - produceAtFactory (for each factory with a worker assigned)
 */
function produce(gameState, playerState) {
    playerState.availableActions = [
        game_1.playerActions.produceAtFactory,
        game_1.playerActions.endStep,
    ];
    return {
        response: {
            availableActions: playerState.availableActions
        }
    };
}
exports.produce = produce;
//# sourceMappingURL=produce.js.map