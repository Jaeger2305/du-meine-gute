"use strict";
exports.__esModule = true;
exports.buildFactory = void 0;
/**
 * Puts a card from a players hand into play.
 * Returns the function to update the client game state
 */
function buildFactory(gameState, playerState, resources) {
    console.warn("No validation of build factory by the server");
    return {
        response: { isOK: true }
    };
}
exports.buildFactory = buildFactory;
//# sourceMappingURL=build-factory.js.map