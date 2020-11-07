"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.draw = void 0;
var lodash_1 = require("lodash");
var game_1 = require("../../game");
/**
 * Returns valid actions that can be performed, which is drawing 3 cards.
 * After drawing, the user is allowed to discard 2 cards as well, but that's appended after completing the drawing.
 */
function draw(gameState, playerState) {
    var drawCardCount = gameState.config.drawCount +
        lodash_1.sum(playerState.cardsInPlay.map(function (card) { return card.boostDrawCount; }).filter(Boolean));
    var drawCardActions = new Array(drawCardCount).fill(game_1.playerActions.drawCard);
    playerState.availableActions = __spreadArrays(drawCardActions, [game_1.playerActions.endStep]);
    return {
        response: {
            availableActions: playerState.availableActions
        }
    };
}
exports.draw = draw;
//# sourceMappingURL=draw.js.map