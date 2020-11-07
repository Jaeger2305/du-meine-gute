"use strict";
exports.__esModule = true;
exports.revealMarket = void 0;
var game_1 = require("../../game");
var utils_1 = require("../../game/utils");
/**
 * Called twice, once before assigning workers and once after.
 * Resources are revealed from the deck until 3 cards with suns are drawn.
 * Returns valid actions that can be performed, specific for this round.
 * This is normally just an acknowledgement, as the players can't choose anything here.
 */
function revealMarket(gameState, playerState) {
    var _a;
    playerState.availableActions = [game_1.playerActions.endStep];
    var marketCards = [];
    // Draw cards until 3 suns.
    while (marketCards.filter(function (card) { return card.isSunny; }).length <
        gameState.config.marketSuns &&
        (gameState.cardsInDeck.length || gameState.cardsInDiscard.length)) {
        var drawnCard = utils_1.drawFromDeck(gameState.cardsInDeck, gameState.cardsInDiscard);
        marketCards.push(drawnCard);
    }
    (_a = gameState.marketCards).push.apply(_a, marketCards);
    return {
        response: {
            drawnCards: marketCards,
            availableActions: playerState.availableActions,
            marketCards: gameState.marketCards
        }
    };
}
exports.revealMarket = revealMarket;
//# sourceMappingURL=reveal-market.js.map