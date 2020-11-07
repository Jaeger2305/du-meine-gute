"use strict";
exports.__esModule = true;
exports.startRound = void 0;
var game_1 = require("../../game");
/**
 * Returns valid actions that can be performed, which is drawing 3 cards.
 * After drawing, the user is allowed to discard 2 cards as well, but that's appended after completing the drawing.
 */
function startRound(gameState, playerState) {
    playerState.availableActions = [
        game_1.playerActions.discardCard,
        game_1.playerActions.endStep,
    ];
    gameState.marketCards = [];
    return {
        response: {
            availableActions: playerState.availableActions
        }
    };
}
exports.startRound = startRound;
//# sourceMappingURL=start-round.js.map