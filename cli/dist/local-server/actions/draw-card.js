"use strict";
exports.__esModule = true;
exports.drawCard = void 0;
var utils_1 = require("../../game/utils");
/**
 * Reveals a card from the deck after the user has requested drawing a card.
 * Returns the function to update the client game state
 */
function drawCard(gameState, playerState, unknownCard) {
    // If network game, submit the socket and return.
    // this.gameSocket.send("drawCard")
    // Draw the card
    var drawnCard = utils_1.drawFromDeck(gameState.cardsInDeck, gameState.cardsInDiscard);
    if (drawnCard)
        Object.assign(unknownCard, drawnCard);
    // Send the response back
    var response = { isOK: true };
    return {
        response: response
    };
}
exports.drawCard = drawCard;
//# sourceMappingURL=draw-card.js.map