"use strict";
exports.__esModule = true;
exports.boss = exports.master = exports.skilledApprentice = exports.apprentice = exports.bossAssigned = exports.defaultSecondaryChainedAssignedEmployee = exports.discountedChainedAssignedEmployee = exports.discountedAssignedEmployee = exports.defaultChainedAssignedEmployee = exports.defaultAssignedEmployee = void 0;
var card_1 = require("./card");
var resources_1 = require("../resources");
exports.defaultAssignedEmployee = {
    name: "defaultAssignedEmployee",
    assignment: card_1.bakery,
    mode: {
        productionCount: 1,
        resourceSparingCount: 0
    },
    unassignmentCost: 0
};
exports.defaultChainedAssignedEmployee = {
    name: "defaultChainedAssignedEmployee",
    assignment: card_1.bakeryWithChain,
    mode: {
        productionCount: 1,
        resourceSparingCount: 0
    },
    unassignmentCost: 0
};
exports.discountedAssignedEmployee = {
    name: "discountedAssignedEmployee",
    assignment: card_1.bakery,
    mode: {
        productionCount: 1,
        resourceSparingCount: 1
    },
    unassignmentCost: 0
};
exports.discountedChainedAssignedEmployee = {
    name: "discountedChainedAssignedEmployee",
    assignment: card_1.bakeryWithChain,
    mode: {
        productionCount: 2,
        resourceSparingCount: 1
    },
    unassignmentCost: 0
};
exports.defaultSecondaryChainedAssignedEmployee = {
    name: "defaultSecondaryChainedAssignedEmployee",
    assignment: card_1.bakeryWithSecondaryChain,
    mode: {
        productionCount: 1,
        resourceSparingCount: 0
    },
    unassignmentCost: 0
};
exports.bossAssigned = {
    name: "bossAssigned",
    assignment: card_1.bakery,
    mode: {
        productionCount: 2,
        resourceSparingCount: 0
    },
    unassignmentCost: 0
};
exports.apprentice = {
    modes: [{ productionCount: 1, resourceSparingCount: 0 }],
    name: "apprentice-1",
    resourceSpecialty: [resources_1.wood],
    cost: 3,
    points: 2,
    unassignmentCost: 2
};
exports.skilledApprentice = {
    modes: [{ productionCount: 3, resourceSparingCount: 0 }],
    name: "skilled-apprentice-1",
    resourceSpecialty: [resources_1.wheat],
    cost: 4,
    points: 3,
    unassignmentCost: 2
};
exports.master = {
    modes: [{ productionCount: 1, resourceSparingCount: 0 }],
    name: "master-1",
    resourceSpecialty: [resources_1.wheat],
    cost: 5,
    points: 4,
    unassignmentCost: 2
};
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