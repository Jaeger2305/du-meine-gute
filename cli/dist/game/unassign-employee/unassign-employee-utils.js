"use strict";
exports.__esModule = true;
exports.unassignWorker = void 0;
var __1 = require("..");
var utils_1 = require("../utils");
function unassignWorker(_a, _b, worker, resourcePayment) {
    var reservedCards = _a.reservedCards, cardsInDiscard = _a.cardsInDiscard;
    var resources = _b.resources, availableActions = _b.availableActions, assignedEmployees = _b.assignedEmployees;
    var employeeIndex = assignedEmployees.findIndex(function (assignedWorker) { return assignedWorker.name === worker.name; });
    assignedEmployees.splice(employeeIndex, 1);
    utils_1.spendResources(reservedCards, cardsInDiscard, resources, resourcePayment);
    // Delete all events other than the end step
    availableActions.splice(0, availableActions.length, __1.playerActions.endStep);
}
exports.unassignWorker = unassignWorker;
//# sourceMappingURL=unassign-employee-utils.js.map