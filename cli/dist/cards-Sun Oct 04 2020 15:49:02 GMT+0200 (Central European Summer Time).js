"use strict";
exports.__esModule = true;
exports.weavingMillMetal = exports.millWood = void 0;
exports.millWood = {
    name: "mill-wood",
    resource: "wheat",
    cost: 4,
    points: 2,
    type: "BuildingType.mill",
    productionConfig: {
        input: ["wood", "wool", "wood", "wood"],
        output: [],
        chainInput: []
    }
};
exports.weavingMillMetal = {
    name: "weaving-mill-metal",
    resource: "wool",
    cost: 5,
    points: 2,
    type: "BuildingType.weavingMill",
    isSunny: true,
    productionConfig: {
        input: ["metal", "wheat", "metal", "metal"],
        output: ["cloth"],
        chainInput: ["wool"]
    }
};
//# sourceMappingURL=cards-Sun Oct 04 2020 15:49:02 GMT+0200 (Central European Summer Time).js.map