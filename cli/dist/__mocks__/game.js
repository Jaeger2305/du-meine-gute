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
exports.defaultGame = exports.emptyGame = void 0;
var player_1 = require("./player");
exports.emptyGame = {
    config: {
        marketSuns: 3,
        buildCountForEndGame: 8,
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
exports.defaultGame = __assign(__assign({}, exports.emptyGame), { players: [player_1.emptyPlayerState] });
//# sourceMappingURL=game.js.map