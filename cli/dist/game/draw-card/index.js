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
exports.drawCard = void 0;
var draw_card_1 = require("../../local-server/actions/draw-card");
var types_1 = require("../../types");
var cards_1 = require("../cards");
var utils_1 = require("../utils");
function createUnknownCard(baseCard) {
    if (baseCard === void 0) { baseCard = cards_1.unknown; }
    return __assign(__assign({}, cards_1.unknown), baseCard);
}
function drawCard(gameState, playerState) {
    var unknownCard = createUnknownCard();
    playerState.cardsInHand.push(unknownCard);
    // Find the event and delete it
    utils_1.removeActionFromAvailableActions(playerState, types_1.PlayerActionEnum.drawCard);
    setTimeout(function () { return draw_card_1.drawCard(gameState, playerState, unknownCard); }, 3000);
}
exports.drawCard = drawCard;
//# sourceMappingURL=index.js.map