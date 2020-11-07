"use strict";
exports.__esModule = true;
exports.payForWorker = void 0;
var __1 = require("..");
var utils_1 = require("../utils");
/**
 * Puts a card from the available worker pool into the employees of a user.
 * Returns the function to update the client game state
 */
function payForWorker(_a, _b, worker, resourcePayment) {
    var availableEmployees = _a.availableEmployees, reservedCards = _a.reservedCards, cardsInDiscard = _a.cardsInDiscard;
    var employees = _b.employees, resources = _b.resources, availableActions = _b.availableActions;
    var employeeIndex = availableEmployees.findIndex(function (availableWorker) { return availableWorker.name === worker.name; });
    var hiredEmployee = availableEmployees.splice(employeeIndex, 1);
    employees.push.apply(employees, hiredEmployee);
    utils_1.spendResources(reservedCards, cardsInDiscard, resources, resourcePayment);
    // Delete all events other than the end step
    availableActions.splice(0, availableActions.length, __1.playerActions.endStep);
}
exports.payForWorker = payForWorker;
//# sourceMappingURL=hire-worker-utils.js.map