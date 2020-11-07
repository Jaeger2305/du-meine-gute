"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.assignEmployee = void 0;
var prompts = require("prompts");
var types_1 = require("../../types");
var assign_employee_1 = require("../../local-server/actions/assign-employee");
var utils_1 = require("../utils");
function getUnassignedEmployees(employees, assignedEmployees) {
    return employees.filter(function (employee) {
        return !assignedEmployees
            .map(function (assignedEmployee) { return assignedEmployee.name; })
            .includes(employee.name);
    });
}
function getUnoccupiedFactories(assignedEmployees, factories) {
    return factories.filter(function (factory) {
        return factory.productionConfig &&
            !assignedEmployees
                .map(function (assignedEmployee) { return assignedEmployee.assignment.name; })
                .includes(factory.name);
    });
}
function assignEmployee(gameState, playerState) {
    return __awaiter(this, void 0, void 0, function () {
        var unassignedEmployees, unoccupiedFactories, employeeChoice, efficiencyChoice, _a, cardChoice, _b, isOK, resetState, assignedEmployee;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    unassignedEmployees = getUnassignedEmployees(playerState.employees, playerState.assignedEmployees);
                    unoccupiedFactories = getUnoccupiedFactories(playerState.assignedEmployees, playerState.cardsInPlay);
                    // Return early if no employees or unoccupied factories, removing the action.
                    if (!unassignedEmployees.length || !unoccupiedFactories.length)
                        return [2 /*return*/, utils_1.removeActionFromAvailableActions(playerState, types_1.PlayerActionEnum.assignEmployee)];
                    return [4 /*yield*/, prompts({
                            type: "select",
                            message: "pick a worker to assign",
                            name: "employee",
                            choices: unassignedEmployees.map(function (employee) { return ({
                                title: employee.name,
                                value: employee
                            }); })
                        })];
                case 1:
                    employeeChoice = _c.sent();
                    if (!(employeeChoice.employee.modes.length === 1)) return [3 /*break*/, 2];
                    _a = { mode: employeeChoice.employee.modes[0] };
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, prompts({
                        type: "select",
                        message: "pick an efficiency of the worker",
                        name: "mode",
                        choices: employeeChoice.employee.modes.map(function (efficiency) { return ({
                            title: "produces: " + efficiency.productionCount + ", spares: " + efficiency.resourceSparingCount,
                            value: efficiency
                        }); })
                    })];
                case 3:
                    _a = _c.sent();
                    _c.label = 4;
                case 4:
                    efficiencyChoice = _a;
                    return [4 /*yield*/, prompts({
                            type: "select",
                            message: "pick an in-play card to assign the worker",
                            name: "card",
                            choices: unoccupiedFactories.map(function (card) { return ({
                                title: card.name,
                                value: card
                            }); })
                        })];
                case 5:
                    cardChoice = _c.sent();
                    _b = assign_employee_1.assignEmployee(gameState, playerState, employeeChoice.employee, efficiencyChoice.mode, cardChoice.card).response, isOK = _b.isOK, resetState = _b.resetState;
                    if (!isOK) {
                        Object.assign(gameState, resetState);
                    }
                    assignedEmployee = {
                        assignment: cardChoice.card,
                        name: employeeChoice.employee.name,
                        mode: efficiencyChoice.mode,
                        unassignmentCost: employeeChoice.employee.unassignmentCost
                    };
                    playerState.assignedEmployees.push(assignedEmployee);
                    if (!getUnassignedEmployees(playerState.employees, playerState.assignedEmployees).length) {
                        return [2 /*return*/, utils_1.removeActionFromAvailableActions(playerState, types_1.PlayerActionEnum.assignEmployee)];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.assignEmployee = assignEmployee;
//# sourceMappingURL=index.js.map