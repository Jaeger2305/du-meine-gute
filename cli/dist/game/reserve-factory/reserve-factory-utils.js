"use strict";
exports.__esModule = true;
exports.reserveFactory = void 0;
var types_1 = require("../../types");
var utils_1 = require("../utils");
function reserveFactory(playerState, factory) {
    var cardIndex = playerState.cardsInHand.findIndex(function (cardInHand) { return cardInHand.name === factory.name; });
    playerState.cardsInHand.splice(cardIndex, 1);
    playerState.reservedFactory = factory;
    utils_1.removeActionFromAvailableActions(playerState, types_1.PlayerActionEnum.reserveFactory);
}
exports.reserveFactory = reserveFactory;
//# sourceMappingURL=reserve-factory-utils.js.map