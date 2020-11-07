"use strict";
exports.__esModule = true;
exports.windowMakerWool = exports.windowMakerMetalWheat = exports.windowMakerMetalClay = exports.weavingMillWoolClay = exports.weavingMillWool = exports.weavingMillWoodClay = exports.weavingMillWood = exports.weavingMillWheatWool = exports.weavingMillMetalWood = exports.weavingMillMetal = exports.weavingMillClay = exports.toolMakerWoolWood = exports.toolMakerWoodWool = exports.toolMakerWheatClay = exports.toolMakerMetalWood = exports.tanneryWoodWool = exports.tanneryWheatWool = exports.tanneryMetalWood = exports.tailorWoodClay = exports.tailorWheatWool = exports.tailorWheatClay = exports.tailorClayWheat = exports.tailorMetalWool = exports.tailorMetalClay = exports.shoemakerWool = exports.shoemakerWood = exports.shoemakerWheat = exports.sawmillWoolClay = exports.sawmillWool = exports.sawmillWoodClay = exports.sawmillMetalClay = exports.sawmillClayMetal = exports.millWool = exports.millWood = exports.millWoodWool = exports.millWheatWool = exports.millMetal = exports.millClay = exports.marketOfficeWool3 = exports.marketOfficeWool2 = exports.marketOfficeWool1 = exports.marketOfficeWood2 = exports.marketOfficeWood1 = exports.marketOfficeWheat3 = exports.marketOfficeWheat2 = exports.marketOfficeWheat1 = exports.marketOfficeMetal3 = exports.marketOfficeMetal2 = exports.marketOfficeMetal1 = exports.marketOfficeDraw3 = exports.marketOfficeDraw2 = exports.marketOfficeDraw1 = exports.marketOfficeClay3 = exports.marketOfficeClay2 = exports.marketOfficeClay1 = exports.ironSmelterWoolClay = exports.ironSmelterWheatWood = exports.ironSmelterMetalWool = exports.ironSmelterMetalWheat = exports.ironSmelterMetalClay = exports.ironSmelterMetal = exports.glassmakerSun = exports.glassmakerCheapSun = exports.glassmakerCheap = exports.glassmaker = exports.foodFactoryWool = exports.foodFactoryWood = exports.foodFactoryMetal = exports.cooperageWheatClay = exports.cooperageClayWheat = exports.cooperageMetalWool = exports.cooperageMetalClay = exports.cattleRanchWoolClay = exports.cattleRanchWheatWool = exports.cattleRanchWheat = exports.cattleRanchMetalWool = exports.cattleRanchMetalWood = exports.cattleRanchMetalWheat = exports.butcherWoodWool = exports.butcherWood = exports.butcherMetalWheat = exports.brickMakerWood = exports.brickMakerMetalWool = exports.brickMakerMetalWood = exports.brickMakerWoodMetal = exports.brickMakerMetalWheat = exports.brickMakerClayMetal = exports.brickMakerMetalClay = exports.brickMaker = exports.bakeryWool = exports.bakeryWoodWool = exports.bakeryMetal = exports.bakeryClay = exports.bakerWoolWood = void 0;
var types_1 = require("./types");
exports.bakerWoolWood = {
    name: "baker-wool-wood",
    resource: wheat,
    cost: 11,
    points: 3,
    type: types_1.BuildingType.bakery,
    isSunny: true,
    productionConfig: {
        input: [wood, wool, wood, wool, wool],
        output: [bread],
        chainInput: [coal, grain]
    }
};
exports.bakeryClay = {
    name: "bakery-clay",
    resource: wheat,
    cost: 9,
    points: 3,
    type: types_1.BuildingType.bakery,
    isSunny: true,
    productionConfig: {
        input: [clay, wheat, clay, wheat, wheat],
        output: [bread],
        chainInput: [cloth, grain]
    }
};
exports.bakeryMetal = {
    name: "bakery-metal",
    resource: wheat,
    cost: 9,
    points: 3,
    type: types_1.BuildingType.bakery,
    isSunny: true,
    productionConfig: {
        input: [clay, metal, clay, metal, clay],
        output: [bread],
        chainInput: [coal, grain]
    }
};
exports.bakeryWoodWool = {
    name: "bakery-wood-wool",
    resource: wheat,
    cost: 12,
    points: 3,
    type: types_1.BuildingType.bakery,
    isSunny: true,
    productionConfig: {
        input: [wood, wool, wood, wool, wood],
        output: [bread],
        chainInput: [coal, grain]
    }
};
exports.bakeryWool = {
    name: "bakery-wool",
    resource: wheat,
    cost: 9,
    points: 3,
    type: types_1.BuildingType.bakery,
    isSunny: true,
    productionConfig: {
        input: [wheat, wool, wheat, wool, wool],
        output: [bread],
        chainInput: [coal, grain]
    }
};
exports.brickMaker = {
    name: "brick-maker",
    resource: clay,
    cost: 5,
    points: 2,
    type: types_1.BuildingType.brickMaker,
    productionConfig: {
        input: [wood, wool, wood, wood],
        output: [brick],
        chainInput: [clay, coal]
    }
};
exports.brickMakerMetalClay = {
    name: "brick-maker-metal-clay",
    resource: clay,
    cost: 2,
    points: 2,
    type: types_1.BuildingType.brickMaker,
    productionConfig: {
        input: [clay, metal, metal, metal],
        output: [brick],
        chainInput: [clay, coal]
    }
};
exports.brickMakerClayMetal = {
    name: "brick-maker-clay-metal",
    resource: clay,
    cost: 3,
    points: 2,
    type: types_1.BuildingType.brickMaker,
    isSunny: true,
    productionConfig: {
        input: [clay, metal, clay, metal],
        output: [brick],
        chainInput: [clay, coal]
    }
};
exports.brickMakerMetalWheat = {
    name: "brick-maker-metal-wheat",
    resource: clay,
    cost: 3,
    points: 2,
    type: types_1.BuildingType.brickMaker,
    isSunny: true,
    productionConfig: {
        input: [metal, wheat, metal, wheat],
        output: [brick],
        chainInput: [clay, coal]
    }
};
exports.brickMakerWoodMetal = {
    name: "brick-maker-wood-metal",
    resource: clay,
    cost: 5,
    points: 2,
    type: types_1.BuildingType.brickMaker,
    isSunny: true,
    productionConfig: {
        input: [metal, wood, metal, wood],
        output: [brick],
        chainInput: [clay, coal]
    }
};
exports.brickMakerMetalWood = {
    name: "brick-maker-metal-wood",
    resource: clay,
    cost: 5,
    points: 2,
    type: types_1.BuildingType.brickMaker,
    productionConfig: {
        input: [metal, wood, wood, wood],
        output: [brick],
        chainInput: [clay, coal]
    }
};
exports.brickMakerMetalWool = {
    name: "brick-maker-metal-wool",
    resource: clay,
    cost: 3,
    points: 2,
    type: types_1.BuildingType.brickMaker,
    isSunny: true,
    productionConfig: {
        input: [metal, wool, metal, wool],
        output: [brick],
        chainInput: [clay, coal]
    }
};
exports.brickMakerWood = {
    name: "brick-maker-wood",
    resource: clay,
    cost: 5,
    points: 2,
    type: types_1.BuildingType.brickMaker,
    productionConfig: {
        input: [wood, wool, wood, wool],
        output: [brick],
        chainInput: [clay, coal]
    }
};
exports.butcherMetalWheat = {
    name: "butcher-metal-wheat",
    resource: wool,
    cost: 12,
    points: 4,
    type: types_1.BuildingType.butcher,
    isSunny: true,
    productionConfig: {
        input: [metal, wheat, metal, wheat, metal, metal],
        output: [meat],
        chainInput: [cattle]
    }
};
exports.butcherWood = {
    name: "butcher-wood",
    resource: wool,
    cost: 15,
    points: 4,
    type: types_1.BuildingType.butcher,
    isSunny: true,
    productionConfig: {
        input: [clay, wood, clay, wood, clay, wood],
        output: [meat],
        chainInput: [cattle]
    }
};
exports.butcherWoodWool = {
    name: "butcher-wood-wool",
    resource: wool,
    cost: 16,
    points: 4,
    type: types_1.BuildingType.butcher,
    productionConfig: {
        input: [wood, wool, wood, wool, wood, wood],
        output: [meat],
        chainInput: [cattle]
    }
};
exports.cattleRanchMetalWheat = {
    name: "cattle-ranch-metal-wheat",
    resource: clay,
    cost: 6,
    points: 2,
    type: types_1.BuildingType.cattleRanch,
    isSunny: true,
    productionConfig: {
        input: [metal, wheat, metal, wheat],
        output: [cattle],
        chainInput: [wheat]
    }
};
exports.cattleRanchMetalWood = {
    name: "cattle-ranch-metal-wood",
    resource: clay,
    cost: 8,
    points: 2,
    type: types_1.BuildingType.cattleRanch,
    isSunny: true,
    productionConfig: {
        input: [metal, wood, metal, wood],
        output: [cattle],
        chainInput: [wheat]
    }
};
exports.cattleRanchMetalWool = {
    name: "cattle-ranch-metal-wool",
    resource: clay,
    cost: 6,
    points: 2,
    type: types_1.BuildingType.cattleRanch,
    productionConfig: {
        input: [metal, wool, metal, wool],
        output: [cattle],
        chainInput: [wheat]
    }
};
exports.cattleRanchWheat = {
    name: "cattle-ranch-wheat",
    resource: clay,
    cost: 8,
    points: 2,
    type: types_1.BuildingType.cattleRanch,
    isSunny: true,
    productionConfig: {
        input: [wheat, wood, wheat, wood],
        output: [cattle],
        chainInput: [wheat]
    }
};
exports.cattleRanchWheatWool = {
    name: "cattle-ranch-wheat-wool",
    resource: clay,
    cost: 6,
    points: 2,
    type: types_1.BuildingType.cattleRanch,
    productionConfig: {
        input: [wheat, wool, wheat, wool],
        output: [cattle],
        chainInput: [wheat]
    }
};
exports.cattleRanchWoolClay = {
    name: "cattle-ranch-wool-clay",
    resource: clay,
    cost: 6,
    points: 2,
    type: types_1.BuildingType.cattleRanch,
    productionConfig: {
        input: [clay, wool, clay, wool],
        output: [cattle],
        chainInput: [wheat]
    }
};
exports.cooperageMetalClay = {
    name: "cooperage-metal-clay",
    resource: wood,
    cost: 11,
    points: 3,
    type: types_1.BuildingType.cooperage,
    productionConfig: {
        input: [clay, metal, clay, metal, clay],
        output: [barrel],
        chainInput: [plank]
    }
};
exports.cooperageMetalWool = {
    name: "cooperage-metal-wool",
    resource: wood,
    cost: 11,
    points: 3,
    type: types_1.BuildingType.cooperage,
    productionConfig: {
        input: [metal, wool, metal, wool, metal],
        output: [barrel],
        chainInput: [plank]
    }
};
exports.cooperageClayWheat = {
    name: "cooperage-clay-wheat",
    resource: wood,
    cost: 11,
    points: 3,
    type: types_1.BuildingType.cooperage,
    isSunny: true,
    productionConfig: {
        input: [clay, wheat, clay, wheat, clay],
        output: [barrel],
        chainInput: [plank]
    }
};
exports.cooperageWheatClay = {
    name: "cooperage-wheat-clay",
    resource: wood,
    cost: 11,
    points: 3,
    type: types_1.BuildingType.cooperage,
    isSunny: true,
    productionConfig: {
        input: [clay, wheat, clay, wheat, wheat],
        output: [barrel],
        chainInput: [plank]
    }
};
exports.foodFactoryMetal = {
    name: "food-factory-metal",
    resource: wheat,
    cost: 19,
    points: 5,
    type: types_1.BuildingType.foodFactory,
    productionConfig: {
        input: [metal, wheat, metal, wheat, metal, wheat],
        output: [feast],
        chainInput: [bread]
    }
};
exports.foodFactoryWood = {
    name: "food-factory-wood",
    resource: wheat,
    cost: 21,
    points: 5,
    type: types_1.BuildingType.foodFactory,
    productionConfig: {
        input: [clay, wood, clay, wood, wood, wood],
        output: [feast],
        chainInput: [bread]
    }
};
exports.foodFactoryWool = {
    name: "food-factory-wool",
    resource: wheat,
    cost: 17,
    points: 5,
    type: types_1.BuildingType.foodFactory,
    productionConfig: {
        input: [clay, wool, clay, wool, wool, wool],
        output: [feast],
        chainInput: [bread]
    }
};
exports.glassmaker = {
    name: "glassmaker",
    resource: wood,
    cost: 5,
    points: 2,
    type: types_1.BuildingType.glassmaker,
    productionConfig: {
        input: [
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
        ],
        output: [glass]
    }
};
exports.glassmakerCheap = {
    name: "glassmaker-cheap",
    resource: wood,
    cost: 2,
    points: 2,
    type: types_1.BuildingType.glassmaker,
    productionConfig: {
        input: [
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
        ],
        output: [glass]
    }
};
exports.glassmakerCheapSun = {
    name: "glassmaker-cheap-sun",
    resource: wood,
    cost: 2,
    points: 2,
    type: types_1.BuildingType.glassmaker,
    isSunny: true,
    productionConfig: {
        input: [
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
        ],
        output: [glass]
    }
};
exports.glassmakerSun = {
    name: "glassmaker-sun",
    resource: wood,
    cost: 5,
    points: 2,
    type: types_1.BuildingType.glassmaker,
    isSunny: true,
    productionConfig: {
        input: [
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
            placeholder,
        ],
        output: [glass]
    }
};
exports.ironSmelterMetal = {
    name: "iron-smelter-metal",
    resource: wood,
    cost: 8,
    points: 2,
    type: types_1.BuildingType.ironSmelter,
    productionConfig: {
        input: [clay, wheat, clay, wheat],
        output: [ingot],
        chainInput: [metal, coal]
    }
};
exports.ironSmelterMetalClay = {
    name: "iron-smelter-metal-clay",
    resource: wood,
    cost: 6,
    points: 2,
    type: types_1.BuildingType.ironSmelter,
    productionConfig: {
        input: [clay, metal, clay, clay],
        output: [ingot],
        chainInput: [metal, coal]
    }
};
exports.ironSmelterMetalWheat = {
    name: "iron-smelter-metal-wheat",
    resource: wood,
    cost: 8,
    points: 2,
    type: types_1.BuildingType.ironSmelter,
    isSunny: true,
    productionConfig: {
        input: [metal, wheat, metal, wheat],
        output: [ingot],
        chainInput: [metal, coal]
    }
};
exports.ironSmelterMetalWool = {
    name: "iron-smelter-metal-wool",
    resource: wood,
    cost: 8,
    points: 2,
    type: types_1.BuildingType.ironSmelter,
    productionConfig: {
        input: [metal, wool, metal, wool],
        output: [ingot],
        chainInput: [metal, coal]
    }
};
exports.ironSmelterWheatWood = {
    name: "iron-smelter-wheat-wood",
    resource: wood,
    cost: 9,
    points: 2,
    type: types_1.BuildingType.ironSmelter,
    isSunny: true,
    productionConfig: {
        input: [wheat, wood, wheat, wood],
        output: [ingot],
        chainInput: [metal, coal]
    }
};
exports.ironSmelterWoolClay = {
    name: "iron-smelter-wool-clay",
    resource: wood,
    cost: 6,
    points: 2,
    type: types_1.BuildingType.ironSmelter,
    isSunny: true,
    productionConfig: {
        input: [clay, wool, wool, wool],
        output: [ingot],
        chainInput: [metal, coal]
    }
};
exports.marketOfficeClay1 = {
    name: "market-office-clay-1",
    resource: metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [clay],
    isSunny: true
};
exports.marketOfficeClay2 = {
    name: "market-office-clay-2",
    resource: metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [clay]
};
exports.marketOfficeClay3 = {
    name: "market-office-clay-3",
    resource: metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [clay]
};
exports.marketOfficeDraw1 = {
    name: "market-office-draw-1",
    resource: metal,
    cost: 6,
    points: 2,
    type: types_1.BuildingType.marketOffice,
    boostDrawCount: 1
};
exports.marketOfficeDraw2 = {
    name: "market-office-draw-2",
    resource: metal,
    cost: 6,
    points: 2,
    type: types_1.BuildingType.marketOffice,
    boostDrawCount: 1
};
exports.marketOfficeDraw3 = {
    name: "market-office-draw-3",
    resource: metal,
    cost: 6,
    points: 2,
    type: types_1.BuildingType.marketOffice,
    boostDrawCount: 1,
    isSunny: true
};
exports.marketOfficeMetal1 = {
    name: "market-office-metal-1",
    resource: metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [metal],
    isSunny: true
};
exports.marketOfficeMetal2 = {
    name: "market-office-metal-2",
    resource: metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [metal],
    isSunny: true
};
exports.marketOfficeMetal3 = {
    name: "market-office-metal-3",
    resource: metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [metal],
    isSunny: true
};
exports.marketOfficeWheat1 = {
    name: "market-office-wheat-1",
    resource: metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [wheat]
};
exports.marketOfficeWheat2 = {
    name: "market-office-wheat-2",
    resource: metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [wheat]
};
exports.marketOfficeWheat3 = {
    name: "market-office-wheat-3",
    resource: metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [wheat]
};
exports.marketOfficeWood1 = {
    name: "market-office-wood-1",
    resource: metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [wood]
};
exports.marketOfficeWood2 = {
    name: "market-office-wood-2",
    resource: metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [wood]
};
exports.marketOfficeWool1 = {
    name: "market-office-wool-1",
    resource: metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [wool],
    isSunny: true
};
exports.marketOfficeWool2 = {
    name: "market-office-wool-2",
    resource: metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [wool],
    isSunny: true
};
exports.marketOfficeWool3 = {
    name: "market-office-wool-3",
    resource: metal,
    cost: 8,
    points: 3,
    type: types_1.BuildingType.marketOffice,
    marketBoost: [wool],
    isSunny: true
};
exports.millClay = {
    name: "mill-clay",
    resource: wheat,
    cost: 3,
    points: 2,
    type: types_1.BuildingType.mill,
    productionConfig: {
        input: [clay, wheat, clay, wheat],
        output: [grain],
        chainInput: [wheat]
    }
};
exports.millMetal = {
    name: "mill-metal",
    resource: wheat,
    cost: 4,
    points: 2,
    type: types_1.BuildingType.mill,
    isSunny: true,
    productionConfig: {
        input: [metal, wood, metal, wood],
        output: [grain],
        chainInput: [wheat]
    }
};
exports.millWheatWool = {
    name: "mill-wheat-wool",
    resource: wheat,
    cost: 3,
    points: 2,
    type: types_1.BuildingType.mill,
    isSunny: true,
    productionConfig: {
        input: [wheat, wool, wheat, wool],
        output: [grain],
        chainInput: [wheat]
    }
};
exports.millWoodWool = {
    name: "mill-wood-wool",
    resource: wheat,
    cost: 4,
    points: 2,
    type: types_1.BuildingType.mill,
    productionConfig: {
        input: [wood, wool, wood, wood],
        output: [grain],
        chainInput: [wheat]
    }
};
exports.millWood = {
    name: "mill-wood",
    resource: wheat,
    cost: 3,
    points: 2,
    type: types_1.BuildingType.mill,
    isSunny: true,
    productionConfig: {
        input: [wheat, wood, wheat, wheat],
        output: [grain],
        chainInput: [wheat]
    }
};
exports.millWool = {
    name: "mill-wool",
    resource: wheat,
    cost: 2,
    points: 2,
    type: types_1.BuildingType.mill,
    productionConfig: {
        input: [wheat, wool, wheat, wheat],
        output: [grain],
        chainInput: [wheat]
    }
};
exports.sawmillClayMetal = {
    name: "sawmill-clay-metal",
    resource: wood,
    cost: 2,
    points: 2,
    type: types_1.BuildingType.sawmill,
    isSunny: true,
    productionConfig: {
        input: [clay, metal, clay, clay],
        output: [plank],
        chainInput: [wood]
    }
};
exports.sawmillMetalClay = {
    name: "sawmill-metal-clay",
    resource: wood,
    cost: 3,
    points: 2,
    type: types_1.BuildingType.sawmill,
    isSunny: true,
    productionConfig: {
        input: [clay, metal, clay, metal],
        output: [plank],
        chainInput: [wood]
    }
};
exports.sawmillWoodClay = {
    name: "sawmill-wood-clay",
    resource: wood,
    cost: 4,
    points: 2,
    type: types_1.BuildingType.sawmill,
    productionConfig: {
        input: [clay, wool, clay, wood],
        output: [plank],
        chainInput: [wood]
    }
};
exports.sawmillWool = {
    name: "sawmill-wool",
    resource: wood,
    cost: 3,
    points: 2,
    type: types_1.BuildingType.sawmill,
    productionConfig: {
        input: [clay, wool, clay, wool],
        output: [plank],
        chainInput: [wood]
    }
};
exports.sawmillWoolClay = {
    name: "sawmill-wool-clay",
    resource: wood,
    cost: 2,
    points: 2,
    type: types_1.BuildingType.sawmill,
    productionConfig: {
        input: [clay, wool, wool, wool],
        output: [plank],
        chainInput: [wood]
    }
};
exports.shoemakerWheat = {
    name: "shoemaker-wheat",
    resource: wheat,
    cost: 12,
    points: 4,
    type: types_1.BuildingType.shoeMaker,
    isSunny: true,
    productionConfig: {
        input: [clay, wheat, clay, wheat, wheat, wheat],
        output: [shoe],
        chainInput: [leather]
    }
};
exports.shoemakerWood = {
    name: "shoemaker-wood",
    resource: wheat,
    cost: 15,
    points: 4,
    type: types_1.BuildingType.shoeMaker,
    isSunny: true,
    productionConfig: {
        input: [wheat, wood, wheat, wood, wheat, wood],
        output: [shoe],
        chainInput: [leather]
    }
};
exports.shoemakerWool = {
    name: "shoemaker-wool",
    resource: wheat,
    cost: 12,
    points: 4,
    type: types_1.BuildingType.shoeMaker,
    productionConfig: {
        input: [wheat, wool, wheat, wool, wool, wool],
        output: [shoe],
        chainInput: [leather]
    }
};
exports.tailorMetalClay = {
    name: "tailor-metal-clay",
    resource: wool,
    cost: 7,
    points: 3,
    type: types_1.BuildingType.tailor,
    isSunny: true,
    productionConfig: {
        input: [clay, metal, clay, metal, clay],
        output: [shirt],
        chainInput: [cloth, coal]
    }
};
exports.tailorMetalWool = {
    name: "tailor-metal-wool",
    resource: wool,
    cost: 7,
    points: 3,
    type: types_1.BuildingType.tailor,
    isSunny: true,
    productionConfig: {
        input: [metal, wool, metal, wool, wool],
        output: [shirt],
        chainInput: [cloth, coal]
    }
};
exports.tailorClayWheat = {
    name: "tailor-clay-wheat",
    resource: wool,
    cost: 6,
    points: 3,
    type: types_1.BuildingType.tailor,
    productionConfig: {
        input: [clay, wheat, clay, clay, clay],
        output: [shirt],
        chainInput: [cloth, coal]
    }
};
exports.tailorWheatClay = {
    name: "tailor-wheat-clay",
    resource: wool,
    cost: 7,
    points: 3,
    type: types_1.BuildingType.tailor,
    isSunny: true,
    productionConfig: {
        input: [clay, wheat, clay, wheat, clay],
        output: [shirt],
        chainInput: [cloth, coal]
    }
};
exports.tailorWheatWool = {
    name: "tailor-wheat-wool",
    resource: wool,
    cost: 7,
    points: 3,
    type: types_1.BuildingType.tailor,
    productionConfig: {
        input: [wheat, wool, wheat, wool, wheat],
        output: [shirt],
        chainInput: [cloth, coal]
    }
};
exports.tailorWoodClay = {
    name: "tailor-wood-clay",
    resource: wool,
    cost: 10,
    points: 3,
    type: types_1.BuildingType.tailor,
    productionConfig: {
        input: [clay, wood, clay, wood, wood],
        output: [shirt],
        chainInput: [cloth, coal]
    }
};
exports.tanneryMetalWood = {
    name: "tannery-metal-wood",
    resource: clay,
    cost: 15,
    points: 3,
    type: types_1.BuildingType.tannery,
    isSunny: true,
    productionConfig: {
        input: [metal, wood, metal, wood, wood],
        output: [leather],
        chainInput: [cattle]
    }
};
exports.tanneryWheatWool = {
    name: "tannery-wheat-wool",
    resource: clay,
    cost: 13,
    points: 3,
    type: types_1.BuildingType.tannery,
    productionConfig: {
        input: [wheat, wool, wheat, wool, wheat],
        output: [leather],
        chainInput: [cattle]
    }
};
exports.tanneryWoodWool = {
    name: "tannery-wood-wool",
    resource: clay,
    cost: 15,
    points: 3,
    type: types_1.BuildingType.tannery,
    productionConfig: {
        input: [wood, wool, wood, wool, wood],
        output: [leather],
        chainInput: [cattle]
    }
};
exports.toolMakerMetalWood = {
    name: "tool-maker-metal-wood",
    resource: wood,
    cost: 17,
    points: 4,
    type: types_1.BuildingType.toolMaker,
    productionConfig: {
        input: [metal, wood, metal, wood, metal, wood],
        output: [tools],
        chainInput: [coal, ingot]
    }
};
exports.toolMakerWheatClay = {
    name: "tool-maker-wheat-clay",
    resource: wood,
    cost: 15,
    points: 4,
    type: types_1.BuildingType.toolMaker,
    productionConfig: {
        input: [clay, wheat, clay, wheat, clay, wheat],
        output: [tools],
        chainInput: [coal, ingot]
    }
};
exports.toolMakerWoodWool = {
    name: "tool-maker-wood-wool",
    resource: wood,
    cost: 17,
    points: 4,
    type: types_1.BuildingType.toolMaker,
    isSunny: true,
    productionConfig: {
        input: [wood, wool, wood, wool, wood, wood],
        output: [tools],
        chainInput: [coal, ingot]
    }
};
exports.toolMakerWoolWood = {
    name: "tool-maker-wool-wood",
    resource: wood,
    cost: 17,
    points: 4,
    type: types_1.BuildingType.toolMaker,
    isSunny: true,
    productionConfig: {
        input: [wood, wool, wood, wool, wood, wool],
        output: [tools],
        chainInput: [coal, ingot]
    }
};
exports.weavingMillClay = {
    name: "weaving-mill-clay",
    resource: wool,
    cost: 5,
    points: 2,
    type: types_1.BuildingType.weavingMill,
    isSunny: true,
    productionConfig: {
        input: [clay, wheat, clay, clay],
        output: [cloth],
        chainInput: [wool]
    }
};
exports.weavingMillMetal = {
    name: "weaving-mill-metal",
    resource: wool,
    cost: 5,
    points: 2,
    type: types_1.BuildingType.weavingMill,
    isSunny: true,
    productionConfig: {
        input: [metal, wheat, metal, metal],
        output: [cloth],
        chainInput: [wool]
    }
};
exports.weavingMillMetalWood = {
    name: "weaving-mill-metal-wood",
    resource: wool,
    cost: 8,
    points: 2,
    type: types_1.BuildingType.weavingMill,
    isSunny: true,
    productionConfig: {
        input: [metal, wood, metal, wood],
        output: [cloth],
        chainInput: [wool]
    }
};
exports.weavingMillWheatWool = {
    name: "weaving-mill-wheat-wool",
    resource: wool,
    cost: 6,
    points: 2,
    type: types_1.BuildingType.weavingMill,
    productionConfig: {
        input: [wheat, wool, wheat, wool],
        output: [cloth],
        chainInput: [wool]
    }
};
exports.weavingMillWood = {
    name: "weaving-mill-wood",
    resource: wool,
    cost: 8,
    points: 2,
    type: types_1.BuildingType.weavingMill,
    isSunny: true,
    productionConfig: {
        input: [wheat, wood, wheat, wood],
        output: [cloth],
        chainInput: [wool]
    }
};
exports.weavingMillWoodClay = {
    name: "weaving-mill-wood-clay",
    resource: wool,
    cost: 8,
    points: 2,
    type: types_1.BuildingType.weavingMill,
    productionConfig: {
        input: [clay, wood, clay, wood],
        output: [cloth],
        chainInput: [wool]
    }
};
exports.weavingMillWool = {
    name: "weaving-mill-wool",
    resource: wool,
    cost: 6,
    points: 2,
    type: types_1.BuildingType.weavingMill,
    productionConfig: {
        input: [metal, wool, metal, wool],
        output: [cloth],
        chainInput: [wool]
    }
};
exports.weavingMillWoolClay = {
    name: "weaving-mill-wool-clay",
    resource: wool,
    cost: 5,
    points: 2,
    type: types_1.BuildingType.weavingMill,
    productionConfig: {
        input: [clay, wool, wool, wool],
        output: [cloth],
        chainInput: [wool]
    }
};
exports.windowMakerMetalClay = {
    name: "window-maker-metal-clay",
    resource: wood,
    cost: 9,
    points: 3,
    type: types_1.BuildingType.windowMaker,
    isSunny: true,
    productionConfig: {
        input: [clay, metal, clay, metal, clay],
        output: [window],
        chainInput: [glass, plank]
    }
};
exports.windowMakerMetalWheat = {
    name: "window-maker-metal-wheat",
    resource: wood,
    cost: 7,
    points: 3,
    type: types_1.BuildingType.windowMaker,
    isSunny: true,
    productionConfig: {
        input: [metal, wheat, wheat, wheat, wheat],
        output: [window],
        chainInput: [glass, plank]
    }
};
exports.windowMakerWool = {
    name: "window-maker-wool",
    resource: wood,
    cost: 9,
    points: 3,
    type: types_1.BuildingType.windowMaker,
    productionConfig: {
        input: [clay, wool, clay, wool, wool],
        output: [window],
        chainInput: [glass, plank]
    }
};
//# sourceMappingURL=card-formatted.js.map