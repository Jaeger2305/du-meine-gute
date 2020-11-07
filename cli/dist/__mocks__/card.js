"use strict";
exports.__esModule = true;
exports.glassblower = exports.tradingPost = exports.office = exports.altTannery = exports.tannery = exports.bakeryWithSecondaryChain = exports.breadCard = exports.bakeryWithChain = exports.altBakery = exports.bakery = exports.sawmill = exports.coalMineMetal = exports.coalMineClay = exports.coalMineWool = exports.coalMineWheat = void 0;
var types_1 = require("../types");
var resources_1 = require("../resources");
// Factories
exports.coalMineWheat = {
    name: "coal-mine-wheat",
    type: types_1.BuildingType.charburner,
    resource: resources_1.wood,
    productionConfig: {
        output: [resources_1.coal],
        input: [resources_1.wood, resources_1.wheat, resources_1.wheat],
        chainInput: [resources_1.wood]
    },
    cost: 0,
    points: 0
};
exports.coalMineWool = {
    name: "coal-mine-wool",
    type: types_1.BuildingType.charburner,
    resource: resources_1.wood,
    productionConfig: {
        output: [resources_1.coal],
        input: [resources_1.wood, resources_1.wool, resources_1.wool],
        chainInput: [resources_1.wood]
    },
    cost: 0,
    points: 0
};
exports.coalMineClay = {
    name: "coal-mine-clay",
    type: types_1.BuildingType.charburner,
    resource: resources_1.wood,
    productionConfig: {
        output: [resources_1.coal],
        input: [resources_1.wood, resources_1.clay, resources_1.clay],
        chainInput: [resources_1.wood]
    },
    cost: 0,
    points: 0
};
exports.coalMineMetal = {
    name: "coal-mine-metal",
    type: types_1.BuildingType.charburner,
    resource: resources_1.wood,
    productionConfig: {
        output: [resources_1.coal],
        input: [resources_1.wood, resources_1.metal, resources_1.metal],
        chainInput: [resources_1.wood]
    },
    cost: 0,
    points: 0
};
exports.sawmill = {
    name: "sawmill-1",
    type: types_1.BuildingType.sawmill,
    resource: resources_1.wood,
    productionConfig: {
        output: [resources_1.plank],
        input: [resources_1.wood, resources_1.clay]
    },
    cost: 3,
    points: 2
};
exports.bakery = {
    name: "bakery-1",
    type: types_1.BuildingType.bakery,
    resource: resources_1.wheat,
    productionConfig: {
        output: [resources_1.bread],
        input: [resources_1.wood, resources_1.wheat]
    },
    cost: 2,
    points: 2
};
exports.altBakery = {
    name: "bakery-2",
    type: types_1.BuildingType.bakery,
    resource: resources_1.wheat,
    productionConfig: {
        output: [resources_1.bread],
        input: [resources_1.clay, resources_1.wheat]
    },
    cost: 2,
    isSunny: true,
    points: 1
};
exports.bakeryWithChain = {
    name: "bakery-3",
    type: types_1.BuildingType.bakery,
    resource: resources_1.wheat,
    productionConfig: {
        output: [resources_1.bread],
        input: [resources_1.wood, resources_1.wheat],
        chainInput: [resources_1.wheat]
    },
    cost: 3,
    points: 2
};
exports.breadCard = {
    type: types_1.BuildingType.bakery,
    name: "test-bread",
    resource: resources_1.wheat,
    productionConfig: {
        output: [resources_1.bread],
        input: [resources_1.coal, resources_1.cattle]
    },
    cost: 2,
    points: 1
};
exports.bakeryWithSecondaryChain = {
    name: "bakery-4",
    type: types_1.BuildingType.bakery,
    resource: resources_1.wheat,
    productionConfig: {
        output: [resources_1.bread],
        input: [resources_1.wood, resources_1.wheat],
        chainInput: [resources_1.metal, resources_1.coal]
    },
    cost: 3,
    points: 2
};
exports.tannery = {
    name: "tannery-1",
    type: types_1.BuildingType.tannery,
    resource: resources_1.clay,
    productionConfig: {
        output: [resources_1.leather],
        input: [resources_1.cattle, resources_1.clay],
        chainInput: [resources_1.wood]
    },
    cost: 4,
    points: 3,
    isSunny: true
};
exports.altTannery = {
    name: "tannery-1",
    type: types_1.BuildingType.tannery,
    resource: resources_1.wood,
    productionConfig: {
        output: [resources_1.leather],
        input: [resources_1.cattle, resources_1.clay],
        chainInput: [resources_1.clay]
    },
    cost: 4,
    points: 3,
    isSunny: true
};
exports.office = {
    name: "office-1",
    type: types_1.BuildingType.marketOffice,
    resource: resources_1.wood,
    cost: 4,
    isSunny: true,
    points: 2,
    boostDrawCount: 1
};
exports.tradingPost = {
    name: "trading-post-1",
    type: types_1.BuildingType.marketOffice,
    resource: resources_1.wood,
    productionConfig: {
        output: [resources_1.glass],
        input: [resources_1.cattle, resources_1.clay],
        chainInput: [resources_1.clay]
    },
    cost: 4,
    points: 2,
    isSunny: true,
    marketBoost: [resources_1.wood]
};
exports.glassblower = {
    name: "glassblower-1",
    type: types_1.BuildingType.glassmaker,
    resource: resources_1.metal,
    productionConfig: {
        output: [resources_1.glass],
        input: [resources_1.placeholder, resources_1.placeholder, resources_1.placeholder]
    },
    cost: 2,
    points: 2,
    isSunny: true
};
//# sourceMappingURL=card.js.map