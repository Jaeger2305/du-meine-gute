"use strict";
exports.__esModule = true;
exports.hireWorker = void 0;
/**
 * Puts a card from the available worker pool into the employees of a user.
 * Returns the function to update the client game state
 */
function hireWorker(gameState, playerState, worker, resources) {
    console.warn("No validation of hiring worker");
    return {
        response: { isOK: true }
    };
}
exports.hireWorker = hireWorker;
//# sourceMappingURL=hire-worker.js.map