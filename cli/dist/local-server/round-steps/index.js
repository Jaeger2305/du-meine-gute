"use strict";
exports.__esModule = true;
exports.roundSteps = void 0;
var reveal_market_1 = require("./reveal-market");
var assign_employees_1 = require("./assign-employees");
var draw_1 = require("./draw");
var produce_1 = require("./produce");
var purchase_1 = require("./purchase");
var start_round_1 = require("./start-round");
var end_round_1 = require("./end-round");
exports.roundSteps = [
    start_round_1.startRound,
    draw_1.draw,
    reveal_market_1.revealMarket,
    assign_employees_1.assignEmployees,
    reveal_market_1.revealMarket,
    produce_1.produce,
    purchase_1.purchase,
    end_round_1.endRound,
];
//# sourceMappingURL=index.js.map