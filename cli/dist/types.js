"use strict";
exports.__esModule = true;
exports.RoundSteps = exports.BuildingType = exports.PlayerActionEnum = void 0;
var PlayerActionEnum;
(function (PlayerActionEnum) {
    PlayerActionEnum["endStep"] = "endStep";
    PlayerActionEnum["drawCard"] = "drawCard";
    PlayerActionEnum["discardCard"] = "discardCard";
    PlayerActionEnum["assignEmployee"] = "assignEmployee";
    PlayerActionEnum["reserveFactory"] = "reserveFactory";
    PlayerActionEnum["unassignEmployee"] = "unassignEmployee";
    PlayerActionEnum["produceAtFactory"] = "produceAtFactory";
    PlayerActionEnum["buildFactory"] = "buildFactory";
    PlayerActionEnum["hireWorker"] = "hireWorker";
})(PlayerActionEnum = exports.PlayerActionEnum || (exports.PlayerActionEnum = {}));
var BuildingType;
(function (BuildingType) {
    BuildingType[BuildingType["bakery"] = 0] = "bakery";
    BuildingType[BuildingType["brickMaker"] = 1] = "brickMaker";
    BuildingType[BuildingType["butcher"] = 2] = "butcher";
    BuildingType[BuildingType["cattleRanch"] = 3] = "cattleRanch";
    BuildingType[BuildingType["charburner"] = 4] = "charburner";
    BuildingType[BuildingType["cooperage"] = 5] = "cooperage";
    BuildingType[BuildingType["foodFactory"] = 6] = "foodFactory";
    BuildingType[BuildingType["glassmaker"] = 7] = "glassmaker";
    BuildingType[BuildingType["ironSmelter"] = 8] = "ironSmelter";
    BuildingType[BuildingType["marketOffice"] = 9] = "marketOffice";
    BuildingType[BuildingType["mill"] = 10] = "mill";
    BuildingType[BuildingType["sawmill"] = 11] = "sawmill";
    BuildingType[BuildingType["shoeMaker"] = 12] = "shoeMaker";
    BuildingType[BuildingType["tailor"] = 13] = "tailor";
    BuildingType[BuildingType["tannery"] = 14] = "tannery";
    BuildingType[BuildingType["toolMaker"] = 15] = "toolMaker";
    BuildingType[BuildingType["unknown"] = 16] = "unknown";
    BuildingType[BuildingType["weavingMill"] = 17] = "weavingMill";
    BuildingType[BuildingType["windowMaker"] = 18] = "windowMaker";
})(BuildingType = exports.BuildingType || (exports.BuildingType = {}));
var Steps;
(function (Steps) {
    Steps["startRound"] = "start";
    Steps["revealMarket"] = "reveal market";
    Steps["assignEmployees"] = "assign";
    Steps["produce"] = "produce";
    Steps["purchase"] = "purchase";
    Steps["endRound"] = "round end";
})(Steps || (Steps = {}));
exports.RoundSteps = [
    Steps.startRound,
    Steps.revealMarket,
    Steps.assignEmployees,
    Steps.revealMarket,
    Steps.produce,
    Steps.purchase,
    Steps.endRound,
];
//# sourceMappingURL=types.js.map