import { BuildingType, Card } from "../types";
import {
  wood,
  wool,
  clay,
  bread,
  wheat,
  metal,
  cattle,
  leather,
  coal,
  plank,
  placeholder,
  unknown as unknownResource,
  glass,
  barrel,
  brick,
  cloth,
  feast,
  grain,
  ingot,
  meat,
  shirt,
  shoe,
  tools,
  window,
} from "../resources";

// Placeholders

export const unknown: Card = {
  name: "placeholder",
  type: BuildingType.unknown,
  resource: unknownResource,
  cost: 0,
  points: 0,
};

// Starter buildings

export const coalMineWheat: Card = {
  name: "coal-mine-wheat",
  type: BuildingType.charburner,
  resource: wood,
  productionConfig: {
    output: [coal],
    input: [wood, wheat, wheat],
    chainInput: [wood],
  },
  cost: 0,
  points: 0,
};

export const coalMineWool: Card = {
  name: "coal-mine-wool",
  type: BuildingType.charburner,
  resource: wood,
  productionConfig: {
    output: [coal],
    input: [wood, wool, wool],
    chainInput: [wood],
  },
  cost: 0,
  points: 0,
};

export const coalMineClay: Card = {
  name: "coal-mine-clay",
  type: BuildingType.charburner,
  resource: wood,
  productionConfig: {
    output: [coal],
    input: [wood, clay, clay],
    chainInput: [wood],
  },
  cost: 0,
  points: 0,
};

export const coalMineMetal: Card = {
  name: "coal-mine-metal",
  type: BuildingType.charburner,
  resource: wood,
  productionConfig: {
    output: [coal],
    input: [wood, metal, metal],
    chainInput: [wood],
  },
  cost: 0,
  points: 0,
};

// General buildings

const bakeryWoolWood: Card = {
  name: "bakery-wool-wood",
  resource: wheat,
  cost: 11,
  points: 3,
  type: BuildingType.bakery,
  isSunny: true,
  productionConfig: {
    input: [wood, wool, wood, wool, wool],
    output: [bread],
    chainInput: [coal, grain],
  },
};
const bakeryClay: Card = {
  name: "bakery-clay",
  resource: wheat,
  cost: 9,
  points: 3,
  type: BuildingType.bakery,
  isSunny: true,
  productionConfig: {
    input: [clay, wheat, clay, wheat, wheat],
    output: [bread],
    chainInput: [cloth, grain],
  },
};
const bakeryMetal: Card = {
  name: "bakery-metal",
  resource: wheat,
  cost: 9,
  points: 3,
  type: BuildingType.bakery,
  isSunny: true,
  productionConfig: {
    input: [clay, metal, clay, metal, clay],
    output: [bread],
    chainInput: [coal, grain],
  },
};
const bakeryWoodWool: Card = {
  name: "bakery-wood-wool",
  resource: wheat,
  cost: 12,
  points: 3,
  type: BuildingType.bakery,
  isSunny: true,
  productionConfig: {
    input: [wood, wool, wood, wool, wood],
    output: [bread],
    chainInput: [coal, grain],
  },
};
const bakeryWool: Card = {
  name: "bakery-wool",
  resource: wheat,
  cost: 9,
  points: 3,
  type: BuildingType.bakery,
  isSunny: true,
  productionConfig: {
    input: [wheat, wool, wheat, wool, wool],
    output: [bread],
    chainInput: [coal, grain],
  },
};
const brickMaker: Card = {
  name: "brick-maker",
  resource: clay,
  cost: 5,
  points: 2,
  type: BuildingType.brickMaker,
  productionConfig: {
    input: [wood, wool, wood, wood],
    output: [brick],
    chainInput: [clay, coal],
  },
};
const brickMakerMetalClay: Card = {
  name: "brick-maker-metal-clay",
  resource: clay,
  cost: 2,
  points: 2,
  type: BuildingType.brickMaker,
  productionConfig: {
    input: [clay, metal, metal, metal],
    output: [brick],
    chainInput: [clay, coal],
  },
};
const brickMakerClayMetal: Card = {
  name: "brick-maker-clay-metal",
  resource: clay,
  cost: 3,
  points: 2,
  type: BuildingType.brickMaker,
  isSunny: true,
  productionConfig: {
    input: [clay, metal, clay, metal],
    output: [brick],
    chainInput: [clay, coal],
  },
};
const brickMakerMetalWheat: Card = {
  name: "brick-maker-metal-wheat",
  resource: clay,
  cost: 3,
  points: 2,
  type: BuildingType.brickMaker,
  isSunny: true,
  productionConfig: {
    input: [metal, wheat, metal, wheat],
    output: [brick],
    chainInput: [clay, coal],
  },
};
const brickMakerWoodMetal: Card = {
  name: "brick-maker-wood-metal",
  resource: clay,
  cost: 5,
  points: 2,
  type: BuildingType.brickMaker,
  isSunny: true,
  productionConfig: {
    input: [metal, wood, metal, wood],
    output: [brick],
    chainInput: [clay, coal],
  },
};
const brickMakerMetalWood: Card = {
  name: "brick-maker-metal-wood",
  resource: clay,
  cost: 5,
  points: 2,
  type: BuildingType.brickMaker,
  productionConfig: {
    input: [metal, wood, wood, wood],
    output: [brick],
    chainInput: [clay, coal],
  },
};
const brickMakerMetalWool: Card = {
  name: "brick-maker-metal-wool",
  resource: clay,
  cost: 3,
  points: 2,
  type: BuildingType.brickMaker,
  isSunny: true,
  productionConfig: {
    input: [metal, wool, metal, wool],
    output: [brick],
    chainInput: [clay, coal],
  },
};
const brickMakerWood: Card = {
  name: "brick-maker-wood",
  resource: clay,
  cost: 5,
  points: 2,
  type: BuildingType.brickMaker,
  productionConfig: {
    input: [wood, wool, wood, wool],
    output: [brick],
    chainInput: [clay, coal],
  },
};
const butcherMetalWheat: Card = {
  name: "butcher-metal-wheat",
  resource: wool,
  cost: 12,
  points: 4,
  type: BuildingType.butcher,
  isSunny: true,
  productionConfig: {
    input: [metal, wheat, metal, wheat, metal, metal],
    output: [meat],
    chainInput: [cattle],
  },
};
const butcherWood: Card = {
  name: "butcher-wood",
  resource: wool,
  cost: 15,
  points: 4,
  type: BuildingType.butcher,
  isSunny: true,
  productionConfig: {
    input: [clay, wood, clay, wood, clay, wood],
    output: [meat],
    chainInput: [cattle],
  },
};
const butcherWoodWool: Card = {
  name: "butcher-wood-wool",
  resource: wool,
  cost: 16,
  points: 4,
  type: BuildingType.butcher,
  productionConfig: {
    input: [wood, wool, wood, wool, wood, wood],
    output: [meat],
    chainInput: [cattle],
  },
};
const cattleRanchMetalWheat: Card = {
  name: "cattle-ranch-metal-wheat",
  resource: clay,
  cost: 6,
  points: 2,
  type: BuildingType.cattleRanch,
  isSunny: true,
  productionConfig: {
    input: [metal, wheat, metal, wheat],
    output: [cattle],
    chainInput: [wheat],
  },
};
const cattleRanchMetalWood: Card = {
  name: "cattle-ranch-metal-wood",
  resource: clay,
  cost: 8,
  points: 2,
  type: BuildingType.cattleRanch,
  isSunny: true,
  productionConfig: {
    input: [metal, wood, metal, wood],
    output: [cattle],
    chainInput: [wheat],
  },
};
const cattleRanchMetalWool: Card = {
  name: "cattle-ranch-metal-wool",
  resource: clay,
  cost: 6,
  points: 2,
  type: BuildingType.cattleRanch,
  productionConfig: {
    input: [metal, wool, metal, wool],
    output: [cattle],
    chainInput: [wheat],
  },
};
const cattleRanchWheat: Card = {
  name: "cattle-ranch-wheat",
  resource: clay,
  cost: 8,
  points: 2,
  type: BuildingType.cattleRanch,
  isSunny: true,
  productionConfig: {
    input: [wheat, wood, wheat, wood],
    output: [cattle],
    chainInput: [wheat],
  },
};
const cattleRanchWheatWool: Card = {
  name: "cattle-ranch-wheat-wool",
  resource: clay,
  cost: 6,
  points: 2,
  type: BuildingType.cattleRanch,
  productionConfig: {
    input: [wheat, wool, wheat, wool],
    output: [cattle],
    chainInput: [wheat],
  },
};
const cattleRanchWoolClay: Card = {
  name: "cattle-ranch-wool-clay",
  resource: clay,
  cost: 6,
  points: 2,
  type: BuildingType.cattleRanch,
  productionConfig: {
    input: [clay, wool, clay, wool],
    output: [cattle],
    chainInput: [wheat],
  },
};
const cooperageMetalClay: Card = {
  name: "cooperage-metal-clay",
  resource: wood,
  cost: 11,
  points: 3,
  type: BuildingType.cooperage,
  productionConfig: {
    input: [clay, metal, clay, metal, clay],
    output: [barrel],
    chainInput: [plank],
  },
};
const cooperageMetalWool: Card = {
  name: "cooperage-metal-wool",
  resource: wood,
  cost: 11,
  points: 3,
  type: BuildingType.cooperage,
  productionConfig: {
    input: [metal, wool, metal, wool, metal],
    output: [barrel],
    chainInput: [plank],
  },
};
const cooperageClayWheat: Card = {
  name: "cooperage-clay-wheat",
  resource: wood,
  cost: 11,
  points: 3,
  type: BuildingType.cooperage,
  isSunny: true,
  productionConfig: {
    input: [clay, wheat, clay, wheat, clay],
    output: [barrel],
    chainInput: [plank],
  },
};
const cooperageWheatClay: Card = {
  name: "cooperage-wheat-clay",
  resource: wood,
  cost: 11,
  points: 3,
  type: BuildingType.cooperage,
  isSunny: true,
  productionConfig: {
    input: [clay, wheat, clay, wheat, wheat],
    output: [barrel],
    chainInput: [plank],
  },
};
const foodFactoryMetal: Card = {
  name: "food-factory-metal",
  resource: wheat,
  cost: 19,
  points: 5,
  type: BuildingType.foodFactory,
  productionConfig: {
    input: [metal, wheat, metal, wheat, metal, wheat],
    output: [feast],
    chainInput: [bread],
  },
};
const foodFactoryWood: Card = {
  name: "food-factory-wood",
  resource: wheat,
  cost: 21,
  points: 5,
  type: BuildingType.foodFactory,
  productionConfig: {
    input: [clay, wood, clay, wood, wood, wood],
    output: [feast],
    chainInput: [bread],
  },
};
const foodFactoryWool: Card = {
  name: "food-factory-wool",
  resource: wheat,
  cost: 17,
  points: 5,
  type: BuildingType.foodFactory,
  productionConfig: {
    input: [clay, wool, clay, wool, wool, wool],
    output: [feast],
    chainInput: [bread],
  },
};
const glassmaker: Card = {
  name: "glassmaker",
  resource: wood,
  cost: 5,
  points: 2,
  type: BuildingType.glassmaker,
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
    output: [glass],
  },
};
const glassmakerCheap: Card = {
  name: "glassmaker-cheap",
  resource: wood,
  cost: 2,
  points: 2,
  type: BuildingType.glassmaker,
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
    output: [glass],
  },
};
const glassmakerCheapSun: Card = {
  name: "glassmaker-cheap-sun",
  resource: wood,
  cost: 2,
  points: 2,
  type: BuildingType.glassmaker,
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
    output: [glass],
  },
};
const glassmakerSun: Card = {
  name: "glassmaker-sun",
  resource: wood,
  cost: 5,
  points: 2,
  type: BuildingType.glassmaker,
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
    output: [glass],
  },
};
const ironSmelterMetal: Card = {
  name: "iron-smelter-metal",
  resource: wood,
  cost: 8,
  points: 2,
  type: BuildingType.ironSmelter,
  productionConfig: {
    input: [clay, wheat, clay, wheat],
    output: [ingot],
    chainInput: [metal, coal],
  },
};
const ironSmelterMetalClay: Card = {
  name: "iron-smelter-metal-clay",
  resource: wood,
  cost: 6,
  points: 2,
  type: BuildingType.ironSmelter,
  productionConfig: {
    input: [clay, metal, clay, clay],
    output: [ingot],
    chainInput: [metal, coal],
  },
};
const ironSmelterMetalWheat: Card = {
  name: "iron-smelter-metal-wheat",
  resource: wood,
  cost: 8,
  points: 2,
  type: BuildingType.ironSmelter,
  isSunny: true,
  productionConfig: {
    input: [metal, wheat, metal, wheat],
    output: [ingot],
    chainInput: [metal, coal],
  },
};
const ironSmelterMetalWool: Card = {
  name: "iron-smelter-metal-wool",
  resource: wood,
  cost: 8,
  points: 2,
  type: BuildingType.ironSmelter,
  productionConfig: {
    input: [metal, wool, metal, wool],
    output: [ingot],
    chainInput: [metal, coal],
  },
};
const ironSmelterWheatWood: Card = {
  name: "iron-smelter-wheat-wood",
  resource: wood,
  cost: 9,
  points: 2,
  type: BuildingType.ironSmelter,
  isSunny: true,
  productionConfig: {
    input: [wheat, wood, wheat, wood],
    output: [ingot],
    chainInput: [metal, coal],
  },
};
const ironSmelterWoolClay: Card = {
  name: "iron-smelter-wool-clay",
  resource: wood,
  cost: 6,
  points: 2,
  type: BuildingType.ironSmelter,
  isSunny: true,
  productionConfig: {
    input: [clay, wool, wool, wool],
    output: [ingot],
    chainInput: [metal, coal],
  },
};
const marketOfficeClay1: Card = {
  name: "market-office-clay-1",
  resource: metal,
  cost: 8,
  points: 3,
  type: BuildingType.marketOffice,
  marketBoost: [clay],
  isSunny: true,
};
const marketOfficeClay2: Card = {
  name: "market-office-clay-2",
  resource: metal,
  cost: 8,
  points: 3,
  type: BuildingType.marketOffice,
  marketBoost: [clay],
};
const marketOfficeClay3: Card = {
  name: "market-office-clay-3",
  resource: metal,
  cost: 8,
  points: 3,
  type: BuildingType.marketOffice,
  marketBoost: [clay],
};
const marketOfficeDraw1: Card = {
  name: "market-office-draw-1",
  resource: metal,
  cost: 6,
  points: 2,
  type: BuildingType.marketOffice,
  boostDrawCount: 1,
};
const marketOfficeDraw2: Card = {
  name: "market-office-draw-2",
  resource: metal,
  cost: 6,
  points: 2,
  type: BuildingType.marketOffice,
  boostDrawCount: 1,
};
const marketOfficeDraw3: Card = {
  name: "market-office-draw-3",
  resource: metal,
  cost: 6,
  points: 2,
  type: BuildingType.marketOffice,
  boostDrawCount: 1,
  isSunny: true,
};
const marketOfficeMetal1: Card = {
  name: "market-office-metal-1",
  resource: metal,
  cost: 8,
  points: 3,
  type: BuildingType.marketOffice,
  marketBoost: [metal],
  isSunny: true,
};
const marketOfficeMetal2: Card = {
  name: "market-office-metal-2",
  resource: metal,
  cost: 8,
  points: 3,
  type: BuildingType.marketOffice,
  marketBoost: [metal],
  isSunny: true,
};
const marketOfficeMetal3: Card = {
  name: "market-office-metal-3",
  resource: metal,
  cost: 8,
  points: 3,
  type: BuildingType.marketOffice,
  marketBoost: [metal],
  isSunny: true,
};
const marketOfficeWheat1: Card = {
  name: "market-office-wheat-1",
  resource: metal,
  cost: 8,
  points: 3,
  type: BuildingType.marketOffice,
  marketBoost: [wheat],
};
const marketOfficeWheat2: Card = {
  name: "market-office-wheat-2",
  resource: metal,
  cost: 8,
  points: 3,
  type: BuildingType.marketOffice,
  marketBoost: [wheat],
};
const marketOfficeWheat3: Card = {
  name: "market-office-wheat-3",
  resource: metal,
  cost: 8,
  points: 3,
  type: BuildingType.marketOffice,
  marketBoost: [wheat],
};
const marketOfficeWood1: Card = {
  name: "market-office-wood-1",
  resource: metal,
  cost: 8,
  points: 3,
  type: BuildingType.marketOffice,
  marketBoost: [wood],
};
const marketOfficeWood2: Card = {
  name: "market-office-wood-2",
  resource: metal,
  cost: 8,
  points: 3,
  type: BuildingType.marketOffice,
  marketBoost: [wood],
};
const marketOfficeWool1: Card = {
  name: "market-office-wool-1",
  resource: metal,
  cost: 8,
  points: 3,
  type: BuildingType.marketOffice,
  marketBoost: [wool],
  isSunny: true,
};
const marketOfficeWool2: Card = {
  name: "market-office-wool-2",
  resource: metal,
  cost: 8,
  points: 3,
  type: BuildingType.marketOffice,
  marketBoost: [wool],
  isSunny: true,
};
const marketOfficeWool3: Card = {
  name: "market-office-wool-3",
  resource: metal,
  cost: 8,
  points: 3,
  type: BuildingType.marketOffice,
  marketBoost: [wool],
  isSunny: true,
};
const millClay: Card = {
  name: "mill-clay",
  resource: wheat,
  cost: 3,
  points: 2,
  type: BuildingType.mill,
  productionConfig: {
    input: [clay, wheat, clay, wheat],
    output: [grain],
    chainInput: [wheat],
  },
};
const millMetal: Card = {
  name: "mill-metal",
  resource: wheat,
  cost: 4,
  points: 2,
  type: BuildingType.mill,
  isSunny: true,
  productionConfig: {
    input: [metal, wood, metal, wood],
    output: [grain],
    chainInput: [wheat],
  },
};
const millWheatWool: Card = {
  name: "mill-wheat-wool",
  resource: wheat,
  cost: 3,
  points: 2,
  type: BuildingType.mill,
  isSunny: true,
  productionConfig: {
    input: [wheat, wool, wheat, wool],
    output: [grain],
    chainInput: [wheat],
  },
};
const millWoodWool: Card = {
  name: "mill-wood-wool",
  resource: wheat,
  cost: 4,
  points: 2,
  type: BuildingType.mill,
  productionConfig: {
    input: [wood, wool, wood, wood],
    output: [grain],
    chainInput: [wheat],
  },
};
const millWood: Card = {
  name: "mill-wood",
  resource: wheat,
  cost: 3,
  points: 2,
  type: BuildingType.mill,
  isSunny: true,
  productionConfig: {
    input: [wheat, wood, wheat, wheat],
    output: [grain],
    chainInput: [wheat],
  },
};
const millWool: Card = {
  name: "mill-wool",
  resource: wheat,
  cost: 2,
  points: 2,
  type: BuildingType.mill,
  productionConfig: {
    input: [wheat, wool, wheat, wheat],
    output: [grain],
    chainInput: [wheat],
  },
};
const sawmillClayMetal: Card = {
  name: "sawmill-clay-metal",
  resource: wood,
  cost: 2,
  points: 2,
  type: BuildingType.sawmill,
  isSunny: true,
  productionConfig: {
    input: [clay, metal, clay, clay],
    output: [plank],
    chainInput: [wood],
  },
};
const sawmillMetalClay: Card = {
  name: "sawmill-metal-clay",
  resource: wood,
  cost: 3,
  points: 2,
  type: BuildingType.sawmill,
  isSunny: true,
  productionConfig: {
    input: [clay, metal, clay, metal],
    output: [plank],
    chainInput: [wood],
  },
};
const sawmillWoodClay: Card = {
  name: "sawmill-wood-clay",
  resource: wood,
  cost: 4,
  points: 2,
  type: BuildingType.sawmill,
  productionConfig: {
    input: [clay, wool, clay, wood],
    output: [plank],
    chainInput: [wood],
  },
};
const sawmillWool: Card = {
  name: "sawmill-wool",
  resource: wood,
  cost: 3,
  points: 2,
  type: BuildingType.sawmill,
  productionConfig: {
    input: [clay, wool, clay, wool],
    output: [plank],
    chainInput: [wood],
  },
};
const sawmillWoolClay: Card = {
  name: "sawmill-wool-clay",
  resource: wood,
  cost: 2,
  points: 2,
  type: BuildingType.sawmill,
  productionConfig: {
    input: [clay, wool, wool, wool],
    output: [plank],
    chainInput: [wood],
  },
};
const shoemakerWheat: Card = {
  name: "shoemaker-wheat",
  resource: wheat,
  cost: 12,
  points: 4,
  type: BuildingType.shoeMaker,
  isSunny: true,
  productionConfig: {
    input: [clay, wheat, clay, wheat, wheat, wheat],
    output: [shoe],
    chainInput: [leather],
  },
};
const shoemakerWood: Card = {
  name: "shoemaker-wood",
  resource: wheat,
  cost: 15,
  points: 4,
  type: BuildingType.shoeMaker,
  isSunny: true,
  productionConfig: {
    input: [wheat, wood, wheat, wood, wheat, wood],
    output: [shoe],
    chainInput: [leather],
  },
};
const shoemakerWool: Card = {
  name: "shoemaker-wool",
  resource: wheat,
  cost: 12,
  points: 4,
  type: BuildingType.shoeMaker,
  productionConfig: {
    input: [wheat, wool, wheat, wool, wool, wool],
    output: [shoe],
    chainInput: [leather],
  },
};
const tailorMetalClay: Card = {
  name: "tailor-metal-clay",
  resource: wool,
  cost: 7,
  points: 3,
  type: BuildingType.tailor,
  isSunny: true,
  productionConfig: {
    input: [clay, metal, clay, metal, clay],
    output: [shirt],
    chainInput: [cloth, coal],
  },
};
const tailorMetalWool: Card = {
  name: "tailor-metal-wool",
  resource: wool,
  cost: 7,
  points: 3,
  type: BuildingType.tailor,
  isSunny: true,
  productionConfig: {
    input: [metal, wool, metal, wool, wool],
    output: [shirt],
    chainInput: [cloth, coal],
  },
};
const tailorClayWheat: Card = {
  name: "tailor-clay-wheat",
  resource: wool,
  cost: 6,
  points: 3,
  type: BuildingType.tailor,
  productionConfig: {
    input: [clay, wheat, clay, clay, clay],
    output: [shirt],
    chainInput: [cloth, coal],
  },
};
const tailorWheatClay: Card = {
  name: "tailor-wheat-clay",
  resource: wool,
  cost: 7,
  points: 3,
  type: BuildingType.tailor,
  isSunny: true,
  productionConfig: {
    input: [clay, wheat, clay, wheat, clay],
    output: [shirt],
    chainInput: [cloth, coal],
  },
};
const tailorWheatWool: Card = {
  name: "tailor-wheat-wool",
  resource: wool,
  cost: 7,
  points: 3,
  type: BuildingType.tailor,
  productionConfig: {
    input: [wheat, wool, wheat, wool, wheat],
    output: [shirt],
    chainInput: [cloth, coal],
  },
};
const tailorWoodClay: Card = {
  name: "tailor-wood-clay",
  resource: wool,
  cost: 10,
  points: 3,
  type: BuildingType.tailor,
  productionConfig: {
    input: [clay, wood, clay, wood, wood],
    output: [shirt],
    chainInput: [cloth, coal],
  },
};
const tanneryMetalWood: Card = {
  name: "tannery-metal-wood",
  resource: clay,
  cost: 15,
  points: 3,
  type: BuildingType.tannery,
  isSunny: true,
  productionConfig: {
    input: [metal, wood, metal, wood, wood],
    output: [leather],
    chainInput: [cattle],
  },
};
const tanneryWheatWool: Card = {
  name: "tannery-wheat-wool",
  resource: clay,
  cost: 13,
  points: 3,
  type: BuildingType.tannery,
  productionConfig: {
    input: [wheat, wool, wheat, wool, wheat],
    output: [leather],
    chainInput: [cattle],
  },
};
const tanneryWoodWool: Card = {
  name: "tannery-wood-wool",
  resource: clay,
  cost: 15,
  points: 3,
  type: BuildingType.tannery,
  productionConfig: {
    input: [wood, wool, wood, wool, wood],
    output: [leather],
    chainInput: [cattle],
  },
};
const toolMakerMetalWood: Card = {
  name: "tool-maker-metal-wood",
  resource: wood,
  cost: 17,
  points: 4,
  type: BuildingType.toolMaker,
  productionConfig: {
    input: [metal, wood, metal, wood, metal, wood],
    output: [tools],
    chainInput: [coal, ingot],
  },
};
const toolMakerWheatClay: Card = {
  name: "tool-maker-wheat-clay",
  resource: wood,
  cost: 15,
  points: 4,
  type: BuildingType.toolMaker,
  productionConfig: {
    input: [clay, wheat, clay, wheat, clay, wheat],
    output: [tools],
    chainInput: [coal, ingot],
  },
};
const toolMakerWoodWool: Card = {
  name: "tool-maker-wood-wool",
  resource: wood,
  cost: 17,
  points: 4,
  type: BuildingType.toolMaker,
  isSunny: true,
  productionConfig: {
    input: [wood, wool, wood, wool, wood, wood],
    output: [tools],
    chainInput: [coal, ingot],
  },
};
const toolMakerWoolWood: Card = {
  name: "tool-maker-wool-wood",
  resource: wood,
  cost: 17,
  points: 4,
  type: BuildingType.toolMaker,
  isSunny: true,
  productionConfig: {
    input: [wood, wool, wood, wool, wood, wool],
    output: [tools],
    chainInput: [coal, ingot],
  },
};
const weavingMillClay: Card = {
  name: "weaving-mill-clay",
  resource: wool,
  cost: 5,
  points: 2,
  type: BuildingType.weavingMill,
  isSunny: true,
  productionConfig: {
    input: [clay, wheat, clay, clay],
    output: [cloth],
    chainInput: [wool],
  },
};
const weavingMillMetal: Card = {
  name: "weaving-mill-metal",
  resource: wool,
  cost: 5,
  points: 2,
  type: BuildingType.weavingMill,
  isSunny: true,
  productionConfig: {
    input: [metal, wheat, metal, metal],
    output: [cloth],
    chainInput: [wool],
  },
};
const weavingMillMetalWood: Card = {
  name: "weaving-mill-metal-wood",
  resource: wool,
  cost: 8,
  points: 2,
  type: BuildingType.weavingMill,
  isSunny: true,
  productionConfig: {
    input: [metal, wood, metal, wood],
    output: [cloth],
    chainInput: [wool],
  },
};
const weavingMillWheatWool: Card = {
  name: "weaving-mill-wheat-wool",
  resource: wool,
  cost: 6,
  points: 2,
  type: BuildingType.weavingMill,
  productionConfig: {
    input: [wheat, wool, wheat, wool],
    output: [cloth],
    chainInput: [wool],
  },
};
const weavingMillWood: Card = {
  name: "weaving-mill-wood",
  resource: wool,
  cost: 8,
  points: 2,
  type: BuildingType.weavingMill,
  isSunny: true,
  productionConfig: {
    input: [wheat, wood, wheat, wood],
    output: [cloth],
    chainInput: [wool],
  },
};
const weavingMillWoodClay: Card = {
  name: "weaving-mill-wood-clay",
  resource: wool,
  cost: 8,
  points: 2,
  type: BuildingType.weavingMill,
  productionConfig: {
    input: [clay, wood, clay, wood],
    output: [cloth],
    chainInput: [wool],
  },
};
const weavingMillWool: Card = {
  name: "weaving-mill-wool",
  resource: wool,
  cost: 6,
  points: 2,
  type: BuildingType.weavingMill,
  productionConfig: {
    input: [metal, wool, metal, wool],
    output: [cloth],
    chainInput: [wool],
  },
};
const weavingMillWoolClay: Card = {
  name: "weaving-mill-wool-clay",
  resource: wool,
  cost: 5,
  points: 2,
  type: BuildingType.weavingMill,
  productionConfig: {
    input: [clay, wool, wool, wool],
    output: [cloth],
    chainInput: [wool],
  },
};
const windowMakerMetalClay: Card = {
  name: "window-maker-metal-clay",
  resource: wood,
  cost: 9,
  points: 3,
  type: BuildingType.windowMaker,
  isSunny: true,
  productionConfig: {
    input: [clay, metal, clay, metal, clay],
    output: [window],
    chainInput: [glass, plank],
  },
};
const windowMakerMetalWheat: Card = {
  name: "window-maker-metal-wheat",
  resource: wood,
  cost: 7,
  points: 3,
  type: BuildingType.windowMaker,
  isSunny: true,
  productionConfig: {
    input: [metal, wheat, wheat, wheat, wheat],
    output: [window],
    chainInput: [glass, plank],
  },
};
const windowMakerWool: Card = {
  name: "window-maker-wool",
  resource: wood,
  cost: 9,
  points: 3,
  type: BuildingType.windowMaker,
  productionConfig: {
    input: [clay, wool, clay, wool, wool],
    output: [window],
    chainInput: [glass, plank],
  },
};

enum CardName {
  bakeryWoolWood = "BAKERY_WOOL_WOOD",
  bakeryClay = "BAKERY_CLAY",
  bakeryMetal = "BAKERY_METAL",
  bakeryWoodWool = "BAKERY_WOOD_WOOL",
  bakeryWool = "BAKERY_WOOL",
  brickMaker = "BRICK_MAKER",
  brickMakerMetalClay = "BRICK_MAKER_METAL_CLAY",
  brickMakerClayMetal = "BRICK_MAKER_CLAY_METAL",
  brickMakerMetalWheat = "BRICK_MAKER_METAL_WHEAT",
  brickMakerWoodMetal = "BRICK_MAKER_WOOD_METAL",
  brickMakerMetalWood = "BRICK_MAKER_METAL_WOOD",
  brickMakerMetalWool = "BRICK_MAKER_METAL_WOOL",
  brickMakerWood = "BRICK_MAKER_WOOD",
  butcherMetalWheat = "BUTCHER_METAL_WHEAT",
  butcherWood = "BUTCHER_WOOD",
  butcherWoodWool = "BUTCHER_WOOD_WOOL",
  cattleRanchMetalWheat = "CATTLE_RANCH_METAL_WHEAT",
  cattleRanchMetalWood = "CATTLE_RANCH_METAL_WOOD",
  cattleRanchMetalWool = "CATTLE_RANCH_METAL_WOOL",
  cattleRanchWheat = "CATTLE_RANCH_WHEAT",
  cattleRanchWheatWool = "CATTLE_RANCH_WHEAT_WOOL",
  cattleRanchWoolClay = "CATTLE_RANCH_WOOL_CLAY",
  cooperageMetalClay = "COOPERAGE_METAL_CLAY",
  cooperageMetalWool = "COOPERAGE_METAL_WOOL",
  cooperageClayWheat = "COOPERAGE_CLAY_WHEAT",
  cooperageWheatClay = "COOPERAGE_WHEAT_CLAY",
  foodFactoryMetal = "FOOD_FACTORY_METAL",
  foodFactoryWood = "FOOD_FACTORY_WOOD",
  foodFactoryWool = "FOOD_FACTORY_WOOL",
  glassmaker = "GLASSMAKER",
  glassmakerCheap = "GLASSMAKER_CHEAP",
  glassmakerCheapSun = "GLASSMAKER_CHEAP_SUN",
  glassmakerSun = "GLASSMAKER_SUN",
  ironSmelterMetal = "IRON_SMELTER_METAL",
  ironSmelterMetalClay = "IRON_SMELTER_METAL_CLAY",
  ironSmelterMetalWheat = "IRON_SMELTER_METAL_WHEAT",
  ironSmelterMetalWool = "IRON_SMELTER_METAL_WOOL",
  ironSmelterWheatWood = "IRON_SMELTER_WHEAT_WOOD",
  ironSmelterWoolClay = "IRON_SMELTER_WOOL_CLAY",
  marketOfficeClay1 = "MARKET_OFFICE_CLAY1",
  marketOfficeClay2 = "MARKET_OFFICE_CLAY2",
  marketOfficeClay3 = "MARKET_OFFICE_CLAY3",
  marketOfficeDraw1 = "MARKET_OFFICE_DRAW1",
  marketOfficeDraw2 = "MARKET_OFFICE_DRAW2",
  marketOfficeDraw3 = "MARKET_OFFICE_DRAW3",
  marketOfficeMetal1 = "MARKET_OFFICE_METAL1",
  marketOfficeMetal2 = "MARKET_OFFICE_METAL2",
  marketOfficeMetal3 = "MARKET_OFFICE_METAL3",
  marketOfficeWheat1 = "MARKET_OFFICE_WHEAT1",
  marketOfficeWheat2 = "MARKET_OFFICE_WHEAT2",
  marketOfficeWheat3 = "MARKET_OFFICE_WHEAT3",
  marketOfficeWood1 = "MARKET_OFFICE_WOOD1",
  marketOfficeWood2 = "MARKET_OFFICE_WOOD2",
  marketOfficeWool1 = "MARKET_OFFICE_WOOL1",
  marketOfficeWool2 = "MARKET_OFFICE_WOOL2",
  marketOfficeWool3 = "MARKET_OFFICE_WOOL3",
  millClay = "MILL_CLAY",
  millMetal = "MILL_METAL",
  millWheatWool = "MILL_WHEAT_WOOL",
  millWoodWool = "MILL_WOOD_WOOL",
  millWood = "MILL_WOOD",
  millWool = "MILL_WOOL",
  sawmillClayMetal = "SAWMILL_CLAY_METAL",
  sawmillMetalClay = "SAWMILL_METAL_CLAY",
  sawmillWoodClay = "SAWMILL_WOOD_CLAY",
  sawmillWool = "SAWMILL_WOOL",
  sawmillWoolClay = "SAWMILL_WOOL_CLAY",
  shoemakerWheat = "SHOEMAKER_WHEAT",
  shoemakerWood = "SHOEMAKER_WOOD",
  shoemakerWool = "SHOEMAKER_WOOL",
  tailorMetalClay = "TAILOR_METAL_CLAY",
  tailorMetalWool = "TAILOR_METAL_WOOL",
  tailorClayWheat = "TAILOR_CLAY_WHEAT",
  tailorWheatClay = "TAILOR_WHEAT_CLAY",
  tailorWheatWool = "TAILOR_WHEAT_WOOL",
  tailorWoodClay = "TAILOR_WOOD_CLAY",
  tanneryMetalWood = "TANNERY_METAL_WOOD",
  tanneryWheatWool = "TANNERY_WHEAT_WOOL",
  tanneryWoodWool = "TANNERY_WOOD_WOOL",
  toolMakerMetalWood = "TOOL_MAKER_METAL_WOOD",
  toolMakerWheatClay = "TOOL_MAKER_WHEAT_CLAY",
  toolMakerWoodWool = "TOOL_MAKER_WOOD_WOOL",
  toolMakerWoolWood = "TOOL_MAKER_WOOL_WOOD",
  weavingMillClay = "WEAVING_MILL_CLAY",
  weavingMillMetal = "WEAVING_MILL_METAL",
  weavingMillMetalWood = "WEAVING_MILL_METAL_WOOD",
  weavingMillWheatWool = "WEAVING_MILL_WHEAT_WOOL",
  weavingMillWood = "WEAVING_MILL_WOOD",
  weavingMillWoodClay = "WEAVING_MILL_WOOD_CLAY",
  weavingMillWool = "WEAVING_MILL_WOOL",
  weavingMillWoolClay = "WEAVING_MILL_WOOL_CLAY",
  windowMakerMetalClay = "WINDOW_MAKER_METAL_CLAY",
  windowMakerMetalWheat = "WINDOW_MAKER_METAL_WHEAT",
  windowMakerWool = "WINDOW_MAKER_WOOL",
}

export const cardRecords: Record<CardName, Card> = {
  [CardName.bakeryWoolWood]: bakeryWoolWood,
  [CardName.bakeryClay]: bakeryClay,
  [CardName.bakeryMetal]: bakeryMetal,
  [CardName.bakeryWoodWool]: bakeryWoodWool,
  [CardName.bakeryWool]: bakeryWool,
  [CardName.brickMaker]: brickMaker,
  [CardName.brickMakerMetalClay]: brickMakerMetalClay,
  [CardName.brickMakerClayMetal]: brickMakerClayMetal,
  [CardName.brickMakerMetalWheat]: brickMakerMetalWheat,
  [CardName.brickMakerWoodMetal]: brickMakerWoodMetal,
  [CardName.brickMakerMetalWood]: brickMakerMetalWood,
  [CardName.brickMakerMetalWool]: brickMakerMetalWool,
  [CardName.brickMakerWood]: brickMakerWood,
  [CardName.butcherMetalWheat]: butcherMetalWheat,
  [CardName.butcherWood]: butcherWood,
  [CardName.butcherWoodWool]: butcherWoodWool,
  [CardName.cattleRanchMetalWheat]: cattleRanchMetalWheat,
  [CardName.cattleRanchMetalWood]: cattleRanchMetalWood,
  [CardName.cattleRanchMetalWool]: cattleRanchMetalWool,
  [CardName.cattleRanchWheat]: cattleRanchWheat,
  [CardName.cattleRanchWheatWool]: cattleRanchWheatWool,
  [CardName.cattleRanchWoolClay]: cattleRanchWoolClay,
  [CardName.cooperageMetalClay]: cooperageMetalClay,
  [CardName.cooperageMetalWool]: cooperageMetalWool,
  [CardName.cooperageClayWheat]: cooperageClayWheat,
  [CardName.cooperageWheatClay]: cooperageWheatClay,
  [CardName.foodFactoryMetal]: foodFactoryMetal,
  [CardName.foodFactoryWood]: foodFactoryWood,
  [CardName.foodFactoryWool]: foodFactoryWool,
  [CardName.glassmaker]: glassmaker,
  [CardName.glassmakerCheap]: glassmakerCheap,
  [CardName.glassmakerCheapSun]: glassmakerCheapSun,
  [CardName.glassmakerSun]: glassmakerSun,
  [CardName.ironSmelterMetal]: ironSmelterMetal,
  [CardName.ironSmelterMetalClay]: ironSmelterMetalClay,
  [CardName.ironSmelterMetalWheat]: ironSmelterMetalWheat,
  [CardName.ironSmelterMetalWool]: ironSmelterMetalWool,
  [CardName.ironSmelterWheatWood]: ironSmelterWheatWood,
  [CardName.ironSmelterWoolClay]: ironSmelterWoolClay,
  [CardName.marketOfficeClay1]: marketOfficeClay1,
  [CardName.marketOfficeClay2]: marketOfficeClay2,
  [CardName.marketOfficeClay3]: marketOfficeClay3,
  [CardName.marketOfficeDraw1]: marketOfficeDraw1,
  [CardName.marketOfficeDraw2]: marketOfficeDraw2,
  [CardName.marketOfficeDraw3]: marketOfficeDraw3,
  [CardName.marketOfficeMetal1]: marketOfficeMetal1,
  [CardName.marketOfficeMetal2]: marketOfficeMetal2,
  [CardName.marketOfficeMetal3]: marketOfficeMetal3,
  [CardName.marketOfficeWheat1]: marketOfficeWheat1,
  [CardName.marketOfficeWheat2]: marketOfficeWheat2,
  [CardName.marketOfficeWheat3]: marketOfficeWheat3,
  [CardName.marketOfficeWood1]: marketOfficeWood1,
  [CardName.marketOfficeWood2]: marketOfficeWood2,
  [CardName.marketOfficeWool1]: marketOfficeWool1,
  [CardName.marketOfficeWool2]: marketOfficeWool2,
  [CardName.marketOfficeWool3]: marketOfficeWool3,
  [CardName.millClay]: millClay,
  [CardName.millMetal]: millMetal,
  [CardName.millWheatWool]: millWheatWool,
  [CardName.millWoodWool]: millWoodWool,
  [CardName.millWood]: millWood,
  [CardName.millWool]: millWool,
  [CardName.sawmillClayMetal]: sawmillClayMetal,
  [CardName.sawmillMetalClay]: sawmillMetalClay,
  [CardName.sawmillWoodClay]: sawmillWoodClay,
  [CardName.sawmillWool]: sawmillWool,
  [CardName.sawmillWoolClay]: sawmillWoolClay,
  [CardName.shoemakerWheat]: shoemakerWheat,
  [CardName.shoemakerWood]: shoemakerWood,
  [CardName.shoemakerWool]: shoemakerWool,
  [CardName.tailorMetalClay]: tailorMetalClay,
  [CardName.tailorMetalWool]: tailorMetalWool,
  [CardName.tailorClayWheat]: tailorClayWheat,
  [CardName.tailorWheatClay]: tailorWheatClay,
  [CardName.tailorWheatWool]: tailorWheatWool,
  [CardName.tailorWoodClay]: tailorWoodClay,
  [CardName.tanneryMetalWood]: tanneryMetalWood,
  [CardName.tanneryWheatWool]: tanneryWheatWool,
  [CardName.tanneryWoodWool]: tanneryWoodWool,
  [CardName.toolMakerMetalWood]: toolMakerMetalWood,
  [CardName.toolMakerWheatClay]: toolMakerWheatClay,
  [CardName.toolMakerWoodWool]: toolMakerWoodWool,
  [CardName.toolMakerWoolWood]: toolMakerWoolWood,
  [CardName.weavingMillClay]: weavingMillClay,
  [CardName.weavingMillMetal]: weavingMillMetal,
  [CardName.weavingMillMetalWood]: weavingMillMetalWood,
  [CardName.weavingMillWheatWool]: weavingMillWheatWool,
  [CardName.weavingMillWood]: weavingMillWood,
  [CardName.weavingMillWoodClay]: weavingMillWoodClay,
  [CardName.weavingMillWool]: weavingMillWool,
  [CardName.weavingMillWoolClay]: weavingMillWoolClay,
  [CardName.windowMakerMetalClay]: windowMakerMetalClay,
  [CardName.windowMakerMetalWheat]: windowMakerMetalWheat,
  [CardName.windowMakerWool]: windowMakerWool,
};
