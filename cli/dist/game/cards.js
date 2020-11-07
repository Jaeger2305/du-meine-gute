"use strict";
var _a;
exports.__esModule = true;
exports.cardRecords = exports.coalMineMetal = exports.coalMineClay = exports.coalMineWool = exports.coalMineWheat = exports.unknown = void 0;
var types_1 = require("../types");
var resources_1 = require("../resources");
// Placeholders
exports.unknown = {
    name: "placeholder",
    type: types_1.BuildingType.unknown,
    resource: resources_1.unknown,
    cost: 0,
    points: 0
};
// Starter buildings
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
// General buildings
var bakeryWoolWood = {
    name: "bakery-wool-wood",
    resource: resources_1.wheat,
    cost: 11,
    points: 3,
    type: types_1.BuildingType.bakery,
    isSunny: true,
    productionConfig: {
        input: [resources_1.wood, resources_1.wool, resources_1.wood, resources_1.wool, resources_1.wool],
        output: [resources_1.bread],
        chainInput: [resources_1.coal, resources_1.grain]
    }
};
var bakeryClay = {
    name: "bakery-clay",
    resource: resources_1.wheat,
    cost: 9,
    points: 3,
    type: types_1.BuildingType.bakery,
    isSunny: true,
    productionConfig: {
        input: [resources_1.clay, resources_1.wheat, resources_1.clay, resources_1.wheat, resources_1.wheat],
        output: [resources_1.bread],
        chainInput: [resources_1.cloth, resources_1.grain]
    }
};
var bakeryMetal = {
    name: "bakery-metal",
    resource: resources_1.wheat,
    cost: 9,
    points: 3,
    type: types_1.BuildingType.bakery,
    isSunny: true,
    productionConfig: {
        input: [resources_1.clay, resources_1.metal, resources_1.clay, resources_1.metal, resources_1.clay],
        output: [resources_1.bread],
        chainInput: [resources_1.coal, resources_1.grain]
    }
};
var bakeryWoodWool = {
    name: "bakery-wood-wool",
    resource: resources_1.wheat,
    cost: 12,
    points: 3,
    type: types_1.BuildingType.bakery,
    isSunny: true,
    productionConfig: {
        input: [resources_1.wood, resources_1.wool, resources_1.wood, resources_1.wool, resources_1.wood],
        output: [resources_1.bread],
        chainInput: [resources_1.coal, resources_1.grain]
    }
};
var bakeryWool = {
    name: "bakery-wool",
    resource: resources_1.wheat,
    cost: 9,
    points: 3,
    type: types_1.BuildingType.bakery,
    isSunny: true,
    productionConfig: {
        input: [resources_1.wheat, resources_1.wool, resources_1.wheat, resources_1.wool, resources_1.wool],
        output: [resources_1.bread],
        chainInput: [resources_1.coal, resources_1.grain]
    }
};
var brickMaker = {
    name: "brick-maker",
    resource: resources_1.clay,
    cost: 5,
    points: 2,
    type: types_1.BuildingType.brickMaker,
    productionConfig: {
        input: [resources_1.wood, resources_1.wool, resources_1.wood, resources_1.wood],
        output: [resources_1.brick],
        chainInput: [resources_1.clay, resources_1.coal]
    }
};
var brickMakerMetalClay = {
    name: "brick-maker-metal-clay",
    resource: resources_1.clay,
    cost: 2,
    points: 2,
    type: types_1.BuildingType.brickMaker,
    productionConfig: {
        input: [resources_1.clay, resources_1.metal, resources_1.metal, resources_1.metal],
        output: [resources_1.brick],
        chainInput: [resources_1.clay, resources_1.coal]
    }
};
var brickMakerClayMetal = {
    name: "brick-maker-clay-metal",
    resource: resources_1.clay,
    cost: 3,
    points: 2,
    type: types_1.BuildingType.brickMaker,
    isSunny: true,
    productionConfig: {
        input: [resources_1.clay, resources_1.metal, resources_1.clay, resources_1.metal],
        output: [resources_1.brick],
        chainInput: [resources_1.clay, resources_1.coal]
    }
};
var brickMakerMetalWheat = {
    name: "brick-maker-metal-wheat",
    resource: resources_1.clay,
    cost: 3,
    points: 2,
    type: types_1.BuildingType.brickMaker,
    isSunny: true,
    productionConfig: {
        input: [resources_1.metal, resources_1.wheat, resources_1.metal, resources_1.wheat],
        output: [resources_1.brick],
        chainInput: [resources_1.clay, resources_1.coal]
    }
};
var brickMakerWoodMetal = {
    name: "brick-maker-wood-metal",
    resource: resources_1.clay,
    cost: 5,
    points: 2,
    type: types_1.BuildingType.brickMaker,
    isSunny: true,
    productionConfig: {
        input: [resources_1.metal, resources_1.wood, resources_1.metal, resources_1.wood],
        output: [resources_1.brick],
        chainInput: [resources_1.clay, resources_1.coal]
    }
};
var brickMakerMetalWood = {
    name: "brick-maker-metal-wood",
    resource: resources_1.clay,
    cost: 5,
    points: 2,
    type: types_1.BuildingType.brickMaker,
    productionConfig: {
        input: [resources_1.metal, resources_1.wood, resources_1.wood, resources_1.wood],
        output: [resources_1.brick],
        chainInput: [resources_1.clay, resources_1.coal]
    }
};
var brickMakerMetalWool = {
    name: "brick-maker-metal-wool",
    resource: resources_1.clay,
    cost: 3,
    points: 2,
    type: types_1.BuildingType.brickMaker,
    isSunny: true,
    productionConfig: {
        input: [resources_1.metal, resources_1.wool, resources_1.metal, resources_1.wool],
        output: [resources_1.brick],
        chainInput: [resources_1.clay, resources_1.coal]
    }
};
var brickMakerWood = {
    name: "brick-maker-wood",
    resource: resources_1.clay,
    cost: 5,
    points: 2,
    type: types_1.BuildingType.brickMaker,
    productionConfig: {
        input: [resources_1.wood, resources_1.wool, resources_1.wood, resources_1.wool],
        output: [resources_1.brick],
        chainInput: [resources_1.clay, resources_1.coal]
    }
};
var butcherMetalWheat = {
    name: "butcher-metal-wheat",
    resource: resources_1.wool,
    cost: 12,
    points: 4,
    type: types_1.BuildingType.butcher,
    isSunny: true,
    productionConfig: {
        input: [resources_1.metal, resources_1.wheat, resources_1.metal, resources_1.wheat, resources_1.metal, resources_1.metal],
        output: [resources_1.meat],
        chainInput: [resources_1.cattle]
    }
};
var butcherWood = {
    name: "butcher-wood",
    resource: resources_1.wool,
    cost: 15,
    points: 4,
    type: types_1.BuildingType.butcher,
    isSunny: true,
    productionConfig: {
        input: [resources_1.clay, resources_1.wood, resources_1.clay, resources_1.wood, resources_1.clay, resources_1.wood],
        output: [resources_1.meat],
        chainInput: [resources_1.cattle]
    }
};
var butcherWoodWool = {
    name: "butcher-wood-wool",
    resource: resources_1.wool,
    cost: 16,
    points: 4,
    type: types_1.BuildingType.butcher,
    productionConfig: {
        input: [resources_1.wood, resources_1.wool, resources_1.wood, resources_1.wool, resources_1.wood, resources_1.wood],
        output: [resources_1.meat],
        chainInput: [resources_1.cattle]
    }
};
var cattleRanchMetalWheat = {
    name: "cattle-ranch-metal-wheat",
    resource: resources_1.clay,
    cost: 6,
    points: 2,
    type: types_1.BuildingType.cattleRanch,
    isSunny: true,
    productionConfig: {
        input: [resources_1.metal, resources_1.wheat, resources_1.metal, resources_1.wheat],
        output: [resources_1.cattle],
        chainInput: [resources_1.wheat]
    }
};
var cattleRanchMetalWood = {
    name: "cattle-ranch-metal-wood",
    resource: resources_1.clay,
    cost: 8,
    points: 2,
    type: types_1.BuildingType.cattleRanch,
    isSunny: true,
    productionConfig: {
        input: [resources_1.metal, resources_1.wood, resources_1.metal, resources_1.wood],
        output: [resources_1.cattle],
        chainInput: [resources_1.wheat]
    }
};
var cattleRanchMetalWool = {
    name: "cattle-ranch-metal-wool",
    resource: resources_1.clay,
    cost: 6,
    points: 2,
    type: types_1.BuildingType.cattleRanch,
    productionConfig: {
        input: [resources_1.metal, resources_1.wool, resources_1.metal, resources_1.wool],
        output: [resources_1.cattle],
        chainInput: [resources_1.wheat]
    }
};
var cattleRanchWheat = {
    name: "cattle-ranch-wheat",
    resource: resources_1.clay,
    cost: 8,
    points: 2,
    type: types_1.BuildingType.cattleRanch,
    isSunny: true,
    productionConfig: {
        input: [resources_1.wheat, resources_1.wood, resources_1.wheat, resources_1.wood],
        output: [resources_1.cattle],
        chainInput: [resources_1.wheat]
    }
};
var cattleRanchWheatWool = {
    name: "cattle-ranch-wheat-wool",
    resource: resources_1.clay,
    cost: 6,
    points: 2,
    type: types_1.BuildingType.cattleRanch,
    productionConfig: {
        input: [resources_1.wheat, resources_1.wool, resources_1.wheat, resources_1.wool],
        output: [resources_1.cattle],
        chainInput: [resources_1.wheat]
    }
};
var cattleRanchWoolClay = {
    name: "cattle-ranch-wool-clay",
    resource: resources_1.clay,
    cost: 6,
    points: 2,
    type: types_1.BuildingType.cattleRanch,
    productionConfig: {
        input: [resources_1.clay, resources_1.wool, resources_1.clay, resources_1.wool],
        output: [resources_1.cattle],
        chainInput: [resources_1.wheat]
    }
};
var cooperageMetalClay = {
    name: "cooperage-metal-clay",
    resource: resources_1.wood,
    cost: 11,
    points: 3,
    type: types_1.BuildingType.cooperage,
    productionConfig: {
        input: [resources_1.clay, resources_1.metal, resources_1.clay, resources_1.metal, resources_1.clay],
        output: [resources_1.barrel],
        chainInput: [resources_1.plank]
    }
};
var cooperageMetalWool = {
    name: "cooperage-metal-wool",
    resource: resources_1.wood,
    cost: 11,
    points: 3,
    type: types_1.BuildingType.cooperage,
    productionConfig: {
        input: [resources_1.metal, resources_1.wool, resources_1.metal, resources_1.wool, resources_1.metal],
        output: [resources_1.barrel],
        chainInput: [resources_1.plank]
    }
};
var cooperageClayWheat = {
    name: "cooperage-clay-wheat",
    resource: resources_1.wood,
    cost: 11,
    points: 3,
    type: types_1.BuildingType.cooperage,
    isSunny: true,
    productionConfig: {
        input: [resources_1.clay, resources_1.wheat, resources_1.clay, resources_1.wheat, resources_1.clay],
        output: [resources_1.barrel],
        chainInput: [resources_1.plank]
    }
};
var cooperageWheatClay = {
    name: "cooperage-wheat-clay",
    resource: resources_1.wood,
    cost: 11,
    points: 3,
    type: types_1.BuildingType.cooperage,
    isSunny: true,
    productionConfig: {
        input: [resources_1.clay, resources_1.wheat, resources_1.clay, resources_1.wheat, resources_1.wheat],
        output: [resources_1.barrel],
        chainInput: [resources_1.plank]
    }
};
var foodFactoryMetal = {
    name: "food-factory-metal",
    resource: resources_1.wheat,
    cost: 19,
    points: 5,
    type: types_1.BuildingType.foodFactory,
    productionConfig: {
        input: [resources_1.metal, resources_1.wheat, resources_1.metal, resources_1.wheat, resources_1.metal, resources_1.wheat],
        output: [resources_1.feast],
        chainInput: [resources_1.bread]
    }
};
var foodFactoryWood = {
    name: "food-factory-wood",
    resource: resources_1.wheat,
    cost: 21,
    points: 5,
    type: types_1.BuildingType.foodFactory,
    productionConfig: {
        input: [resources_1.clay, resources_1.wood, resources_1.clay, resources_1.wood, resources_1.wood, resources_1.wood],
        output: [resources_1.feast],
        chainInput: [resources_1.bread]
    }
};
var foodFactoryWool = {
    name: "food-factory-wool",
    resource: resources_1.wheat,
    cost: 17,
    points: 5,
    type: types_1.BuildingType.foodFactory,
    productionConfig: {
        input: [resources_1.clay, resources_1.wool, resources_1.clay, resources_1.wool, resources_1.wool, resources_1.wool],
        output: [resources_1.feast],
        chainInput: [resources_1.bread]
    }
};
var glassmaker = {
    name: "glassmaker",
    resource: resources_1.wood,
    cost: 5,
    points: 2,
    type: types_1.BuildingType.glassmaker,
    productionConfig: {
        input: [
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
        ],
        output: [resources_1.glass]
    }
};
var glassmakerCheap = {
    name: "glassmaker-cheap",
    resource: resources_1.wood,
    cost: 2,
    points: 2,
    type: types_1.BuildingType.glassmaker,
    productionConfig: {
        input: [
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
        ],
        output: [resources_1.glass]
    }
};
var glassmakerCheapSun = {
    name: "glassmaker-cheap-sun",
    resource: resources_1.wood,
    cost: 2,
    points: 2,
    type: types_1.BuildingType.glassmaker,
    isSunny: true,
    productionConfig: {
        input: [
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
        ],
        output: [resources_1.glass]
    }
};
var glassmakerSun = {
    name: "glassmaker-sun",
    resource: resources_1.wood,
    cost: 5,
    points: 2,
    type: types_1.BuildingType.glassmaker,
    isSunny: true,
    productionConfig: {
        input: [
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
            resources_1.placeholder,
        ],
        output: [resources_1.glass]
    }
};
var ironSmelterMetal = {
    name: "iron-smelter-metal",
    resource: resources_1.wood,
    cost: 8,
    points: 2,
    type: types_1.BuildingType.ironSmelter,
    productionConfig: {
        input: [resources_1.clay, resources_1.wheat, resources_1.clay, resources_1.wheat],
        output: [resources_1.ingot],
        chainInput: [resources_1.metal, resources_1.coal]
    }
};
var ironSmelterMetalClay = {
    name: "iron-smelter-metal-clay",
    resource: resources_1.wood,
    cost: 6,
    points: 2,
    type: types_1.BuildingType.ironSmelter,
    productionConfig: {
        input: [resources_1.clay, resources_1.metal, resources_1.clay, resources_1.clay],
        output: [resources_1.ingot],
        chainInput: [resources_1.metal, resources_1.coal]
    }
};
var ironSmelterMetalWheat = {
    name: "iron-smelter-metal-wheat",
    resource: resources_1.wood,
    cost: 8,
    points: 2,
    type: types_1.BuildingType.ironSmelter,
    isSunny: true,
    productionConfig: {
        input: [resources_1.metal, resources_1.wheat, resources_1.metal, resources_1.wheat],
        output: [resources_1.ingot],
        chainInput: [resources_1.metal, resources_1.coal]
    }
};
var ironSmelterMetalWool = {
    name: "iron-smelter-metal-wool",
    resource: resources_1.wood,
    cost: 8,
    points: 2,
    type: types_1.BuildingType.ironSmelter,
    productionConfig: {
        input: [resources_1.metal, resources_1.wool, resources_1.metal, resources_1.wool],
        output: [resources_1.ingot],
        chainInput: [resources_1.metal, resources_1.coal]
    }
};
var ironSmelterWheatWood = {
    name: "iron-smelter-wheat-wood",
    resource: resources_1.wood,
    cost: 9,
    points: 2,
    type: types_1.BuildingType.ironSmelter,
    isSunny: true,
    productionConfig: {
        input: [resources_1.wheat, resources_1.wood, resources_1.wheat, resources_1.wood],
        output: [resources_1.ingot],
        chainInput: [resources_1.metal, resources_1.coal]
    }
};
var ironSmelterWoolClay = {
    name: "iron-smelter-wool-clay",
    resource: resources_1.wood,
    cost: 6,
    points: 2,
    type: types_1.BuildingType.ironSmelter,
    isSunny: true,
    productionConfig: {
        input: [resources_1.clay, resources_1.wool, resources_1.wool, resources_1.wool],
        output: [resources_1.ingot],
        chainInput: [resources_1.metal, resources_1.coal]
    }
};
var marketOfficeClay1 = {
    name: "market-office-clay-1",
    resource: resources_1.metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [resources_1.clay],
    isSunny: true
};
var marketOfficeClay2 = {
    name: "market-office-clay-2",
    resource: resources_1.metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [resources_1.clay]
};
var marketOfficeClay3 = {
    name: "market-office-clay-3",
    resource: resources_1.metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [resources_1.clay]
};
var marketOfficeDraw1 = {
    name: "market-office-draw-1",
    resource: resources_1.metal,
    cost: 6,
    points: 2,
    type: types_1.BuildingType.marketOffice,
    boostDrawCount: 1
};
var marketOfficeDraw2 = {
    name: "market-office-draw-2",
    resource: resources_1.metal,
    cost: 6,
    points: 2,
    type: types_1.BuildingType.marketOffice,
    boostDrawCount: 1
};
var marketOfficeDraw3 = {
    name: "market-office-draw-3",
    resource: resources_1.metal,
    cost: 6,
    points: 2,
    type: types_1.BuildingType.marketOffice,
    boostDrawCount: 1,
    isSunny: true
};
var marketOfficeMetal1 = {
    name: "market-office-metal-1",
    resource: resources_1.metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [resources_1.metal],
    isSunny: true
};
var marketOfficeMetal2 = {
    name: "market-office-metal-2",
    resource: resources_1.metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [resources_1.metal],
    isSunny: true
};
var marketOfficeMetal3 = {
    name: "market-office-metal-3",
    resource: resources_1.metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [resources_1.metal],
    isSunny: true
};
var marketOfficeWheat1 = {
    name: "market-office-wheat-1",
    resource: resources_1.metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [resources_1.wheat]
};
var marketOfficeWheat2 = {
    name: "market-office-wheat-2",
    resource: resources_1.metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [resources_1.wheat]
};
var marketOfficeWheat3 = {
    name: "market-office-wheat-3",
    resource: resources_1.metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [resources_1.wheat]
};
var marketOfficeWood1 = {
    name: "market-office-wood-1",
    resource: resources_1.metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [resources_1.wood]
};
var marketOfficeWood2 = {
    name: "market-office-wood-2",
    resource: resources_1.metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [resources_1.wood]
};
var marketOfficeWool1 = {
    name: "market-office-wool-1",
    resource: resources_1.metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [resources_1.wool],
    isSunny: true
};
var marketOfficeWool2 = {
    name: "market-office-wool-2",
    resource: resources_1.metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [resources_1.wool],
    isSunny: true
};
var marketOfficeWool3 = {
    name: "market-office-wool-3",
    resource: resources_1.metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [resources_1.wool],
    isSunny: true
};
var millClay = {
    name: "mill-clay",
    resource: resources_1.wheat,
    cost: 3,
    points: 2,
    type: types_1.BuildingType.mill,
    productionConfig: {
        input: [resources_1.clay, resources_1.wheat, resources_1.clay, resources_1.wheat],
        output: [resources_1.grain],
        chainInput: [resources_1.wheat]
    }
};
var millMetal = {
    name: "mill-metal",
    resource: resources_1.wheat,
    cost: 4,
    points: 2,
    type: types_1.BuildingType.mill,
    isSunny: true,
    productionConfig: {
        input: [resources_1.metal, resources_1.wood, resources_1.metal, resources_1.wood],
        output: [resources_1.grain],
        chainInput: [resources_1.wheat]
    }
};
var millWheatWool = {
    name: "mill-wheat-wool",
    resource: resources_1.wheat,
    cost: 3,
    points: 2,
    type: types_1.BuildingType.mill,
    isSunny: true,
    productionConfig: {
        input: [resources_1.wheat, resources_1.wool, resources_1.wheat, resources_1.wool],
        output: [resources_1.grain],
        chainInput: [resources_1.wheat]
    }
};
var millWoodWool = {
    name: "mill-wood-wool",
    resource: resources_1.wheat,
    cost: 4,
    points: 2,
    type: types_1.BuildingType.mill,
    productionConfig: {
        input: [resources_1.wood, resources_1.wool, resources_1.wood, resources_1.wood],
        output: [resources_1.grain],
        chainInput: [resources_1.wheat]
    }
};
var millWood = {
    name: "mill-wood",
    resource: resources_1.wheat,
    cost: 3,
    points: 2,
    type: types_1.BuildingType.mill,
    isSunny: true,
    productionConfig: {
        input: [resources_1.wheat, resources_1.wood, resources_1.wheat, resources_1.wheat],
        output: [resources_1.grain],
        chainInput: [resources_1.wheat]
    }
};
var millWool = {
    name: "mill-wool",
    resource: resources_1.wheat,
    cost: 2,
    points: 2,
    type: types_1.BuildingType.mill,
    productionConfig: {
        input: [resources_1.wheat, resources_1.wool, resources_1.wheat, resources_1.wheat],
        output: [resources_1.grain],
        chainInput: [resources_1.wheat]
    }
};
var sawmillClayMetal = {
    name: "sawmill-clay-metal",
    resource: resources_1.wood,
    cost: 2,
    points: 2,
    type: types_1.BuildingType.sawmill,
    isSunny: true,
    productionConfig: {
        input: [resources_1.clay, resources_1.metal, resources_1.clay, resources_1.clay],
        output: [resources_1.plank],
        chainInput: [resources_1.wood]
    }
};
var sawmillMetalClay = {
    name: "sawmill-metal-clay",
    resource: resources_1.wood,
    cost: 3,
    points: 2,
    type: types_1.BuildingType.sawmill,
    isSunny: true,
    productionConfig: {
        input: [resources_1.clay, resources_1.metal, resources_1.clay, resources_1.metal],
        output: [resources_1.plank],
        chainInput: [resources_1.wood]
    }
};
var sawmillWoodClay = {
    name: "sawmill-wood-clay",
    resource: resources_1.wood,
    cost: 4,
    points: 2,
    type: types_1.BuildingType.sawmill,
    productionConfig: {
        input: [resources_1.clay, resources_1.wool, resources_1.clay, resources_1.wood],
        output: [resources_1.plank],
        chainInput: [resources_1.wood]
    }
};
var sawmillWool = {
    name: "sawmill-wool",
    resource: resources_1.wood,
    cost: 3,
    points: 2,
    type: types_1.BuildingType.sawmill,
    productionConfig: {
        input: [resources_1.clay, resources_1.wool, resources_1.clay, resources_1.wool],
        output: [resources_1.plank],
        chainInput: [resources_1.wood]
    }
};
var sawmillWoolClay = {
    name: "sawmill-wool-clay",
    resource: resources_1.wood,
    cost: 2,
    points: 2,
    type: types_1.BuildingType.sawmill,
    productionConfig: {
        input: [resources_1.clay, resources_1.wool, resources_1.wool, resources_1.wool],
        output: [resources_1.plank],
        chainInput: [resources_1.wood]
    }
};
var shoemakerWheat = {
    name: "shoemaker-wheat",
    resource: resources_1.wheat,
    cost: 12,
    points: 4,
    type: types_1.BuildingType.shoeMaker,
    isSunny: true,
    productionConfig: {
        input: [resources_1.clay, resources_1.wheat, resources_1.clay, resources_1.wheat, resources_1.wheat, resources_1.wheat],
        output: [resources_1.shoe],
        chainInput: [resources_1.leather]
    }
};
var shoemakerWood = {
    name: "shoemaker-wood",
    resource: resources_1.wheat,
    cost: 15,
    points: 4,
    type: types_1.BuildingType.shoeMaker,
    isSunny: true,
    productionConfig: {
        input: [resources_1.wheat, resources_1.wood, resources_1.wheat, resources_1.wood, resources_1.wheat, resources_1.wood],
        output: [resources_1.shoe],
        chainInput: [resources_1.leather]
    }
};
var shoemakerWool = {
    name: "shoemaker-wool",
    resource: resources_1.wheat,
    cost: 12,
    points: 4,
    type: types_1.BuildingType.shoeMaker,
    productionConfig: {
        input: [resources_1.wheat, resources_1.wool, resources_1.wheat, resources_1.wool, resources_1.wool, resources_1.wool],
        output: [resources_1.shoe],
        chainInput: [resources_1.leather]
    }
};
var tailorMetalClay = {
    name: "tailor-metal-clay",
    resource: resources_1.wool,
    cost: 7,
    points: 3,
    type: types_1.BuildingType.tailor,
    isSunny: true,
    productionConfig: {
        input: [resources_1.clay, resources_1.metal, resources_1.clay, resources_1.metal, resources_1.clay],
        output: [resources_1.shirt],
        chainInput: [resources_1.cloth, resources_1.coal]
    }
};
var tailorMetalWool = {
    name: "tailor-metal-wool",
    resource: resources_1.wool,
    cost: 7,
    points: 3,
    type: types_1.BuildingType.tailor,
    isSunny: true,
    productionConfig: {
        input: [resources_1.metal, resources_1.wool, resources_1.metal, resources_1.wool, resources_1.wool],
        output: [resources_1.shirt],
        chainInput: [resources_1.cloth, resources_1.coal]
    }
};
var tailorClayWheat = {
    name: "tailor-clay-wheat",
    resource: resources_1.wool,
    cost: 6,
    points: 3,
    type: types_1.BuildingType.tailor,
    productionConfig: {
        input: [resources_1.clay, resources_1.wheat, resources_1.clay, resources_1.clay, resources_1.clay],
        output: [resources_1.shirt],
        chainInput: [resources_1.cloth, resources_1.coal]
    }
};
var tailorWheatClay = {
    name: "tailor-wheat-clay",
    resource: resources_1.wool,
    cost: 7,
    points: 3,
    type: types_1.BuildingType.tailor,
    isSunny: true,
    productionConfig: {
        input: [resources_1.clay, resources_1.wheat, resources_1.clay, resources_1.wheat, resources_1.clay],
        output: [resources_1.shirt],
        chainInput: [resources_1.cloth, resources_1.coal]
    }
};
var tailorWheatWool = {
    name: "tailor-wheat-wool",
    resource: resources_1.wool,
    cost: 7,
    points: 3,
    type: types_1.BuildingType.tailor,
    productionConfig: {
        input: [resources_1.wheat, resources_1.wool, resources_1.wheat, resources_1.wool, resources_1.wheat],
        output: [resources_1.shirt],
        chainInput: [resources_1.cloth, resources_1.coal]
    }
};
var tailorWoodClay = {
    name: "tailor-wood-clay",
    resource: resources_1.wool,
    cost: 10,
    points: 3,
    type: types_1.BuildingType.tailor,
    productionConfig: {
        input: [resources_1.clay, resources_1.wood, resources_1.clay, resources_1.wood, resources_1.wood],
        output: [resources_1.shirt],
        chainInput: [resources_1.cloth, resources_1.coal]
    }
};
var tanneryMetalWood = {
    name: "tannery-metal-wood",
    resource: resources_1.clay,
    cost: 15,
    points: 3,
    type: types_1.BuildingType.tannery,
    isSunny: true,
    productionConfig: {
        input: [resources_1.metal, resources_1.wood, resources_1.metal, resources_1.wood, resources_1.wood],
        output: [resources_1.leather],
        chainInput: [resources_1.cattle]
    }
};
var tanneryWheatWool = {
    name: "tannery-wheat-wool",
    resource: resources_1.clay,
    cost: 13,
    points: 3,
    type: types_1.BuildingType.tannery,
    productionConfig: {
        input: [resources_1.wheat, resources_1.wool, resources_1.wheat, resources_1.wool, resources_1.wheat],
        output: [resources_1.leather],
        chainInput: [resources_1.cattle]
    }
};
var tanneryWoodWool = {
    name: "tannery-wood-wool",
    resource: resources_1.clay,
    cost: 15,
    points: 3,
    type: types_1.BuildingType.tannery,
    productionConfig: {
        input: [resources_1.wood, resources_1.wool, resources_1.wood, resources_1.wool, resources_1.wood],
        output: [resources_1.leather],
        chainInput: [resources_1.cattle]
    }
};
var toolMakerMetalWood = {
    name: "tool-maker-metal-wood",
    resource: resources_1.wood,
    cost: 17,
    points: 4,
    type: types_1.BuildingType.toolMaker,
    productionConfig: {
        input: [resources_1.metal, resources_1.wood, resources_1.metal, resources_1.wood, resources_1.metal, resources_1.wood],
        output: [resources_1.tools],
        chainInput: [resources_1.coal, resources_1.ingot]
    }
};
var toolMakerWheatClay = {
    name: "tool-maker-wheat-clay",
    resource: resources_1.wood,
    cost: 15,
    points: 4,
    type: types_1.BuildingType.toolMaker,
    productionConfig: {
        input: [resources_1.clay, resources_1.wheat, resources_1.clay, resources_1.wheat, resources_1.clay, resources_1.wheat],
        output: [resources_1.tools],
        chainInput: [resources_1.coal, resources_1.ingot]
    }
};
var toolMakerWoodWool = {
    name: "tool-maker-wood-wool",
    resource: resources_1.wood,
    cost: 17,
    points: 4,
    type: types_1.BuildingType.toolMaker,
    isSunny: true,
    productionConfig: {
        input: [resources_1.wood, resources_1.wool, resources_1.wood, resources_1.wool, resources_1.wood, resources_1.wood],
        output: [resources_1.tools],
        chainInput: [resources_1.coal, resources_1.ingot]
    }
};
var toolMakerWoolWood = {
    name: "tool-maker-wool-wood",
    resource: resources_1.wood,
    cost: 17,
    points: 4,
    type: types_1.BuildingType.toolMaker,
    isSunny: true,
    productionConfig: {
        input: [resources_1.wood, resources_1.wool, resources_1.wood, resources_1.wool, resources_1.wood, resources_1.wool],
        output: [resources_1.tools],
        chainInput: [resources_1.coal, resources_1.ingot]
    }
};
var weavingMillClay = {
    name: "weaving-mill-clay",
    resource: resources_1.wool,
    cost: 5,
    points: 2,
    type: types_1.BuildingType.weavingMill,
    isSunny: true,
    productionConfig: {
        input: [resources_1.clay, resources_1.wheat, resources_1.clay, resources_1.clay],
        output: [resources_1.cloth],
        chainInput: [resources_1.wool]
    }
};
var weavingMillMetal = {
    name: "weaving-mill-metal",
    resource: resources_1.wool,
    cost: 5,
    points: 2,
    type: types_1.BuildingType.weavingMill,
    isSunny: true,
    productionConfig: {
        input: [resources_1.metal, resources_1.wheat, resources_1.metal, resources_1.metal],
        output: [resources_1.cloth],
        chainInput: [resources_1.wool]
    }
};
var weavingMillMetalWood = {
    name: "weaving-mill-metal-wood",
    resource: resources_1.wool,
    cost: 8,
    points: 2,
    type: types_1.BuildingType.weavingMill,
    isSunny: true,
    productionConfig: {
        input: [resources_1.metal, resources_1.wood, resources_1.metal, resources_1.wood],
        output: [resources_1.cloth],
        chainInput: [resources_1.wool]
    }
};
var weavingMillWheatWool = {
    name: "weaving-mill-wheat-wool",
    resource: resources_1.wool,
    cost: 6,
    points: 2,
    type: types_1.BuildingType.weavingMill,
    productionConfig: {
        input: [resources_1.wheat, resources_1.wool, resources_1.wheat, resources_1.wool],
        output: [resources_1.cloth],
        chainInput: [resources_1.wool]
    }
};
var weavingMillWood = {
    name: "weaving-mill-wood",
    resource: resources_1.wool,
    cost: 8,
    points: 2,
    type: types_1.BuildingType.weavingMill,
    isSunny: true,
    productionConfig: {
        input: [resources_1.wheat, resources_1.wood, resources_1.wheat, resources_1.wood],
        output: [resources_1.cloth],
        chainInput: [resources_1.wool]
    }
};
var weavingMillWoodClay = {
    name: "weaving-mill-wood-clay",
    resource: resources_1.wool,
    cost: 8,
    points: 2,
    type: types_1.BuildingType.weavingMill,
    productionConfig: {
        input: [resources_1.clay, resources_1.wood, resources_1.clay, resources_1.wood],
        output: [resources_1.cloth],
        chainInput: [resources_1.wool]
    }
};
var weavingMillWool = {
    name: "weaving-mill-wool",
    resource: resources_1.wool,
    cost: 6,
    points: 2,
    type: types_1.BuildingType.weavingMill,
    productionConfig: {
        input: [resources_1.metal, resources_1.wool, resources_1.metal, resources_1.wool],
        output: [resources_1.cloth],
        chainInput: [resources_1.wool]
    }
};
var weavingMillWoolClay = {
    name: "weaving-mill-wool-clay",
    resource: resources_1.wool,
    cost: 5,
    points: 2,
    type: types_1.BuildingType.weavingMill,
    productionConfig: {
        input: [resources_1.clay, resources_1.wool, resources_1.wool, resources_1.wool],
        output: [resources_1.cloth],
        chainInput: [resources_1.wool]
    }
};
var windowMakerMetalClay = {
    name: "window-maker-metal-clay",
    resource: resources_1.wood,
    cost: 9,
    points: 3,
    type: types_1.BuildingType.windowMaker,
    isSunny: true,
    productionConfig: {
        input: [resources_1.clay, resources_1.metal, resources_1.clay, resources_1.metal, resources_1.clay],
        output: [resources_1.window],
        chainInput: [resources_1.glass, resources_1.plank]
    }
};
var windowMakerMetalWheat = {
    name: "window-maker-metal-wheat",
    resource: resources_1.wood,
    cost: 7,
    points: 3,
    type: types_1.BuildingType.windowMaker,
    isSunny: true,
    productionConfig: {
        input: [resources_1.metal, resources_1.wheat, resources_1.wheat, resources_1.wheat, resources_1.wheat],
        output: [resources_1.window],
        chainInput: [resources_1.glass, resources_1.plank]
    }
};
var windowMakerWool = {
    name: "window-maker-wool",
    resource: resources_1.wood,
    cost: 9,
    points: 3,
    type: types_1.BuildingType.windowMaker,
    productionConfig: {
        input: [resources_1.clay, resources_1.wool, resources_1.clay, resources_1.wool, resources_1.wool],
        output: [resources_1.window],
        chainInput: [resources_1.glass, resources_1.plank]
    }
};
var CardName;
(function (CardName) {
    CardName["bakeryWoolWood"] = "BAKERY_WOOL_WOOD";
    CardName["bakeryClay"] = "BAKERY_CLAY";
    CardName["bakeryMetal"] = "BAKERY_METAL";
    CardName["bakeryWoodWool"] = "BAKERY_WOOD_WOOL";
    CardName["bakeryWool"] = "BAKERY_WOOL";
    CardName["brickMaker"] = "BRICK_MAKER";
    CardName["brickMakerMetalClay"] = "BRICK_MAKER_METAL_CLAY";
    CardName["brickMakerClayMetal"] = "BRICK_MAKER_CLAY_METAL";
    CardName["brickMakerMetalWheat"] = "BRICK_MAKER_METAL_WHEAT";
    CardName["brickMakerWoodMetal"] = "BRICK_MAKER_WOOD_METAL";
    CardName["brickMakerMetalWood"] = "BRICK_MAKER_METAL_WOOD";
    CardName["brickMakerMetalWool"] = "BRICK_MAKER_METAL_WOOL";
    CardName["brickMakerWood"] = "BRICK_MAKER_WOOD";
    CardName["butcherMetalWheat"] = "BUTCHER_METAL_WHEAT";
    CardName["butcherWood"] = "BUTCHER_WOOD";
    CardName["butcherWoodWool"] = "BUTCHER_WOOD_WOOL";
    CardName["cattleRanchMetalWheat"] = "CATTLE_RANCH_METAL_WHEAT";
    CardName["cattleRanchMetalWood"] = "CATTLE_RANCH_METAL_WOOD";
    CardName["cattleRanchMetalWool"] = "CATTLE_RANCH_METAL_WOOL";
    CardName["cattleRanchWheat"] = "CATTLE_RANCH_WHEAT";
    CardName["cattleRanchWheatWool"] = "CATTLE_RANCH_WHEAT_WOOL";
    CardName["cattleRanchWoolClay"] = "CATTLE_RANCH_WOOL_CLAY";
    CardName["cooperageMetalClay"] = "COOPERAGE_METAL_CLAY";
    CardName["cooperageMetalWool"] = "COOPERAGE_METAL_WOOL";
    CardName["cooperageClayWheat"] = "COOPERAGE_CLAY_WHEAT";
    CardName["cooperageWheatClay"] = "COOPERAGE_WHEAT_CLAY";
    CardName["foodFactoryMetal"] = "FOOD_FACTORY_METAL";
    CardName["foodFactoryWood"] = "FOOD_FACTORY_WOOD";
    CardName["foodFactoryWool"] = "FOOD_FACTORY_WOOL";
    CardName["glassmaker"] = "GLASSMAKER";
    CardName["glassmakerCheap"] = "GLASSMAKER_CHEAP";
    CardName["glassmakerCheapSun"] = "GLASSMAKER_CHEAP_SUN";
    CardName["glassmakerSun"] = "GLASSMAKER_SUN";
    CardName["ironSmelterMetal"] = "IRON_SMELTER_METAL";
    CardName["ironSmelterMetalClay"] = "IRON_SMELTER_METAL_CLAY";
    CardName["ironSmelterMetalWheat"] = "IRON_SMELTER_METAL_WHEAT";
    CardName["ironSmelterMetalWool"] = "IRON_SMELTER_METAL_WOOL";
    CardName["ironSmelterWheatWood"] = "IRON_SMELTER_WHEAT_WOOD";
    CardName["ironSmelterWoolClay"] = "IRON_SMELTER_WOOL_CLAY";
    CardName["marketOfficeClay1"] = "MARKET_OFFICE_CLAY1";
    CardName["marketOfficeClay2"] = "MARKET_OFFICE_CLAY2";
    CardName["marketOfficeClay3"] = "MARKET_OFFICE_CLAY3";
    CardName["marketOfficeDraw1"] = "MARKET_OFFICE_DRAW1";
    CardName["marketOfficeDraw2"] = "MARKET_OFFICE_DRAW2";
    CardName["marketOfficeDraw3"] = "MARKET_OFFICE_DRAW3";
    CardName["marketOfficeMetal1"] = "MARKET_OFFICE_METAL1";
    CardName["marketOfficeMetal2"] = "MARKET_OFFICE_METAL2";
    CardName["marketOfficeMetal3"] = "MARKET_OFFICE_METAL3";
    CardName["marketOfficeWheat1"] = "MARKET_OFFICE_WHEAT1";
    CardName["marketOfficeWheat2"] = "MARKET_OFFICE_WHEAT2";
    CardName["marketOfficeWheat3"] = "MARKET_OFFICE_WHEAT3";
    CardName["marketOfficeWood1"] = "MARKET_OFFICE_WOOD1";
    CardName["marketOfficeWood2"] = "MARKET_OFFICE_WOOD2";
    CardName["marketOfficeWool1"] = "MARKET_OFFICE_WOOL1";
    CardName["marketOfficeWool2"] = "MARKET_OFFICE_WOOL2";
    CardName["marketOfficeWool3"] = "MARKET_OFFICE_WOOL3";
    CardName["millClay"] = "MILL_CLAY";
    CardName["millMetal"] = "MILL_METAL";
    CardName["millWheatWool"] = "MILL_WHEAT_WOOL";
    CardName["millWoodWool"] = "MILL_WOOD_WOOL";
    CardName["millWood"] = "MILL_WOOD";
    CardName["millWool"] = "MILL_WOOL";
    CardName["sawmillClayMetal"] = "SAWMILL_CLAY_METAL";
    CardName["sawmillMetalClay"] = "SAWMILL_METAL_CLAY";
    CardName["sawmillWoodClay"] = "SAWMILL_WOOD_CLAY";
    CardName["sawmillWool"] = "SAWMILL_WOOL";
    CardName["sawmillWoolClay"] = "SAWMILL_WOOL_CLAY";
    CardName["shoemakerWheat"] = "SHOEMAKER_WHEAT";
    CardName["shoemakerWood"] = "SHOEMAKER_WOOD";
    CardName["shoemakerWool"] = "SHOEMAKER_WOOL";
    CardName["tailorMetalClay"] = "TAILOR_METAL_CLAY";
    CardName["tailorMetalWool"] = "TAILOR_METAL_WOOL";
    CardName["tailorClayWheat"] = "TAILOR_CLAY_WHEAT";
    CardName["tailorWheatClay"] = "TAILOR_WHEAT_CLAY";
    CardName["tailorWheatWool"] = "TAILOR_WHEAT_WOOL";
    CardName["tailorWoodClay"] = "TAILOR_WOOD_CLAY";
    CardName["tanneryMetalWood"] = "TANNERY_METAL_WOOD";
    CardName["tanneryWheatWool"] = "TANNERY_WHEAT_WOOL";
    CardName["tanneryWoodWool"] = "TANNERY_WOOD_WOOL";
    CardName["toolMakerMetalWood"] = "TOOL_MAKER_METAL_WOOD";
    CardName["toolMakerWheatClay"] = "TOOL_MAKER_WHEAT_CLAY";
    CardName["toolMakerWoodWool"] = "TOOL_MAKER_WOOD_WOOL";
    CardName["toolMakerWoolWood"] = "TOOL_MAKER_WOOL_WOOD";
    CardName["weavingMillClay"] = "WEAVING_MILL_CLAY";
    CardName["weavingMillMetal"] = "WEAVING_MILL_METAL";
    CardName["weavingMillMetalWood"] = "WEAVING_MILL_METAL_WOOD";
    CardName["weavingMillWheatWool"] = "WEAVING_MILL_WHEAT_WOOL";
    CardName["weavingMillWood"] = "WEAVING_MILL_WOOD";
    CardName["weavingMillWoodClay"] = "WEAVING_MILL_WOOD_CLAY";
    CardName["weavingMillWool"] = "WEAVING_MILL_WOOL";
    CardName["weavingMillWoolClay"] = "WEAVING_MILL_WOOL_CLAY";
    CardName["windowMakerMetalClay"] = "WINDOW_MAKER_METAL_CLAY";
    CardName["windowMakerMetalWheat"] = "WINDOW_MAKER_METAL_WHEAT";
    CardName["windowMakerWool"] = "WINDOW_MAKER_WOOL";
})(CardName || (CardName = {}));
exports.cardRecords = (_a = {},
    _a[CardName.bakeryWoolWood] = bakeryWoolWood,
    _a[CardName.bakeryClay] = bakeryClay,
    _a[CardName.bakeryMetal] = bakeryMetal,
    _a[CardName.bakeryWoodWool] = bakeryWoodWool,
    _a[CardName.bakeryWool] = bakeryWool,
    _a[CardName.brickMaker] = brickMaker,
    _a[CardName.brickMakerMetalClay] = brickMakerMetalClay,
    _a[CardName.brickMakerClayMetal] = brickMakerClayMetal,
    _a[CardName.brickMakerMetalWheat] = brickMakerMetalWheat,
    _a[CardName.brickMakerWoodMetal] = brickMakerWoodMetal,
    _a[CardName.brickMakerMetalWood] = brickMakerMetalWood,
    _a[CardName.brickMakerMetalWool] = brickMakerMetalWool,
    _a[CardName.brickMakerWood] = brickMakerWood,
    _a[CardName.butcherMetalWheat] = butcherMetalWheat,
    _a[CardName.butcherWood] = butcherWood,
    _a[CardName.butcherWoodWool] = butcherWoodWool,
    _a[CardName.cattleRanchMetalWheat] = cattleRanchMetalWheat,
    _a[CardName.cattleRanchMetalWood] = cattleRanchMetalWood,
    _a[CardName.cattleRanchMetalWool] = cattleRanchMetalWool,
    _a[CardName.cattleRanchWheat] = cattleRanchWheat,
    _a[CardName.cattleRanchWheatWool] = cattleRanchWheatWool,
    _a[CardName.cattleRanchWoolClay] = cattleRanchWoolClay,
    _a[CardName.cooperageMetalClay] = cooperageMetalClay,
    _a[CardName.cooperageMetalWool] = cooperageMetalWool,
    _a[CardName.cooperageClayWheat] = cooperageClayWheat,
    _a[CardName.cooperageWheatClay] = cooperageWheatClay,
    _a[CardName.foodFactoryMetal] = foodFactoryMetal,
    _a[CardName.foodFactoryWood] = foodFactoryWood,
    _a[CardName.foodFactoryWool] = foodFactoryWool,
    _a[CardName.glassmaker] = glassmaker,
    _a[CardName.glassmakerCheap] = glassmakerCheap,
    _a[CardName.glassmakerCheapSun] = glassmakerCheapSun,
    _a[CardName.glassmakerSun] = glassmakerSun,
    _a[CardName.ironSmelterMetal] = ironSmelterMetal,
    _a[CardName.ironSmelterMetalClay] = ironSmelterMetalClay,
    _a[CardName.ironSmelterMetalWheat] = ironSmelterMetalWheat,
    _a[CardName.ironSmelterMetalWool] = ironSmelterMetalWool,
    _a[CardName.ironSmelterWheatWood] = ironSmelterWheatWood,
    _a[CardName.ironSmelterWoolClay] = ironSmelterWoolClay,
    _a[CardName.marketOfficeClay1] = marketOfficeClay1,
    _a[CardName.marketOfficeClay2] = marketOfficeClay2,
    _a[CardName.marketOfficeClay3] = marketOfficeClay3,
    _a[CardName.marketOfficeDraw1] = marketOfficeDraw1,
    _a[CardName.marketOfficeDraw2] = marketOfficeDraw2,
    _a[CardName.marketOfficeDraw3] = marketOfficeDraw3,
    _a[CardName.marketOfficeMetal1] = marketOfficeMetal1,
    _a[CardName.marketOfficeMetal2] = marketOfficeMetal2,
    _a[CardName.marketOfficeMetal3] = marketOfficeMetal3,
    _a[CardName.marketOfficeWheat1] = marketOfficeWheat1,
    _a[CardName.marketOfficeWheat2] = marketOfficeWheat2,
    _a[CardName.marketOfficeWheat3] = marketOfficeWheat3,
    _a[CardName.marketOfficeWood1] = marketOfficeWood1,
    _a[CardName.marketOfficeWood2] = marketOfficeWood2,
    _a[CardName.marketOfficeWool1] = marketOfficeWool1,
    _a[CardName.marketOfficeWool2] = marketOfficeWool2,
    _a[CardName.marketOfficeWool3] = marketOfficeWool3,
    _a[CardName.millClay] = millClay,
    _a[CardName.millMetal] = millMetal,
    _a[CardName.millWheatWool] = millWheatWool,
    _a[CardName.millWoodWool] = millWoodWool,
    _a[CardName.millWood] = millWood,
    _a[CardName.millWool] = millWool,
    _a[CardName.sawmillClayMetal] = sawmillClayMetal,
    _a[CardName.sawmillMetalClay] = sawmillMetalClay,
    _a[CardName.sawmillWoodClay] = sawmillWoodClay,
    _a[CardName.sawmillWool] = sawmillWool,
    _a[CardName.sawmillWoolClay] = sawmillWoolClay,
    _a[CardName.shoemakerWheat] = shoemakerWheat,
    _a[CardName.shoemakerWood] = shoemakerWood,
    _a[CardName.shoemakerWool] = shoemakerWool,
    _a[CardName.tailorMetalClay] = tailorMetalClay,
    _a[CardName.tailorMetalWool] = tailorMetalWool,
    _a[CardName.tailorClayWheat] = tailorClayWheat,
    _a[CardName.tailorWheatClay] = tailorWheatClay,
    _a[CardName.tailorWheatWool] = tailorWheatWool,
    _a[CardName.tailorWoodClay] = tailorWoodClay,
    _a[CardName.tanneryMetalWood] = tanneryMetalWood,
    _a[CardName.tanneryWheatWool] = tanneryWheatWool,
    _a[CardName.tanneryWoodWool] = tanneryWoodWool,
    _a[CardName.toolMakerMetalWood] = toolMakerMetalWood,
    _a[CardName.toolMakerWheatClay] = toolMakerWheatClay,
    _a[CardName.toolMakerWoodWool] = toolMakerWoodWool,
    _a[CardName.toolMakerWoolWood] = toolMakerWoolWood,
    _a[CardName.weavingMillClay] = weavingMillClay,
    _a[CardName.weavingMillMetal] = weavingMillMetal,
    _a[CardName.weavingMillMetalWood] = weavingMillMetalWood,
    _a[CardName.weavingMillWheatWool] = weavingMillWheatWool,
    _a[CardName.weavingMillWood] = weavingMillWood,
    _a[CardName.weavingMillWoodClay] = weavingMillWoodClay,
    _a[CardName.weavingMillWool] = weavingMillWool,
    _a[CardName.weavingMillWoolClay] = weavingMillWoolClay,
    _a[CardName.windowMakerMetalClay] = windowMakerMetalClay,
    _a[CardName.windowMakerMetalWheat] = windowMakerMetalWheat,
    _a[CardName.windowMakerWool] = windowMakerWool,
    _a);
//# sourceMappingURL=cards.js.map