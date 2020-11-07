"use strict";
exports.__esModule = true;
exports.boss = exports.seedWorkers = void 0;
var resources_1 = require("../resources");
var lodash_1 = require("lodash");
// Employees
var actor = {
    modes: [{ productionCount: 1, resourceSparingCount: 0 }],
    name: "actor",
    resourceSpecialty: [resources_1.wood, resources_1.wool, resources_1.wool],
    cost: 6,
    points: 3,
    unassignmentCost: 2
};
var banker = {
    modes: [{ productionCount: 1, resourceSparingCount: 0 }],
    name: "banker",
    resourceSpecialty: [resources_1.clay, resources_1.wood, resources_1.metal, resources_1.metal],
    cost: 6,
    points: 3,
    unassignmentCost: 2
};
var brickLayer = {
    modes: [{ productionCount: 1, resourceSparingCount: 0 }],
    name: "brick-layer",
    resourceSpecialty: [resources_1.clay, resources_1.clay],
    cost: 4,
    points: 2,
    unassignmentCost: 2
};
var builder = {
    modes: [{ productionCount: 1, resourceSparingCount: 0 }],
    name: "builder",
    resourceSpecialty: [resources_1.clay, resources_1.clay, resources_1.clay, resources_1.clay],
    cost: 2,
    points: 3,
    unassignmentCost: 2
};
var farmhand = {
    modes: [{ productionCount: 1, resourceSparingCount: 0 }],
    name: "farmhand",
    resourceSpecialty: [resources_1.wheat, resources_1.wheat, resources_1.wheat, resources_1.wheat],
    cost: 3,
    points: 2,
    unassignmentCost: 2
};
var forester = {
    modes: [{ productionCount: 1, resourceSparingCount: 0 }],
    name: "forester",
    resourceSpecialty: [resources_1.wood, resources_1.wood, resources_1.wood, resources_1.wood],
    cost: 2,
    points: 3,
    unassignmentCost: 2
};
var millOwner = {
    modes: [{ productionCount: 1, resourceSparingCount: 0 }],
    name: "mill-owner",
    resourceSpecialty: [resources_1.wheat, resources_1.wheat, resources_1.metal],
    cost: 6,
    points: 3,
    unassignmentCost: 2
};
var officeApprentice = {
    modes: [{ productionCount: 1, resourceSparingCount: 0 }],
    name: "office-apprentice",
    resourceSpecialty: [resources_1.metal, resources_1.metal, resources_1.metal],
    cost: 3,
    points: 2,
    unassignmentCost: 2
};
var officeManager = {
    modes: [{ productionCount: 1, resourceSparingCount: 0 }],
    name: "office-manager",
    resourceSpecialty: [resources_1.metal, resources_1.metal],
    cost: 4,
    points: 2,
    unassignmentCost: 2
};
var overseer = {
    modes: [{ productionCount: 1, resourceSparingCount: 0 }],
    name: "overseer",
    resourceSpecialty: [resources_1.wool, resources_1.metal, resources_1.clay, resources_1.wood, resources_1.wheat],
    cost: 2,
    points: 3,
    unassignmentCost: 2
};
var sawmillManager = {
    modes: [{ productionCount: 1, resourceSparingCount: 0 }],
    name: "sawmill-manager",
    resourceSpecialty: [resources_1.wood, resources_1.wood],
    cost: 4,
    points: 2,
    unassignmentCost: 2
};
var shopOwner = {
    modes: [{ productionCount: 1, resourceSparingCount: 0 }],
    name: "shop-owner",
    resourceSpecialty: [resources_1.wood, resources_1.wool, resources_1.metal, resources_1.metal],
    cost: 2,
    points: 3,
    unassignmentCost: 2
};
var supervisor = {
    modes: [{ productionCount: 1, resourceSparingCount: 0 }],
    name: "supervisor",
    resourceSpecialty: [resources_1.wool, resources_1.clay, resources_1.wood, resources_1.wheat],
    cost: 4,
    points: 3,
    unassignmentCost: 2
};
var tailor = {
    modes: [{ productionCount: 1, resourceSparingCount: 0 }],
    name: "tailor",
    resourceSpecialty: [resources_1.wool, resources_1.wool],
    cost: 4,
    points: 2,
    unassignmentCost: 2
};
var weaver = {
    modes: [{ productionCount: 1, resourceSparingCount: 0 }],
    name: "weaver",
    resourceSpecialty: [resources_1.wool, resources_1.wool, resources_1.wool, resources_1.wool],
    cost: 2,
    points: 3,
    unassignmentCost: 2
};
function seedWorkers(count) {
    var allWorkers = [
        actor,
        banker,
        brickLayer,
        builder,
        farmhand,
        forester,
        millOwner,
        officeApprentice,
        officeManager,
        overseer,
        sawmillManager,
        shopOwner,
        supervisor,
        tailor,
        weaver,
    ];
    if (count > allWorkers.length)
        throw new Error("tried to seed more workers than is possible");
    return lodash_1.shuffle(allWorkers).slice(0, count);
}
exports.seedWorkers = seedWorkers;
exports.boss = {
    modes: [
        { productionCount: 1, resourceSparingCount: 1 },
        { productionCount: 2, resourceSparingCount: 0 },
    ],
    name: "boss-1",
    cost: 0,
    points: 0,
    unassignmentCost: 0
};
//# sourceMappingURL=worker.js.map