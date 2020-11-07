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
var prompts = require("prompts");
var types_1 = require("./types");
var resources_1 = require("./resources");
var lodash_1 = require("lodash");
var fs_1 = require("fs");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var keepGoing, cards, card, _a, sortedCards, typescriptCards;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    keepGoing = true;
                    cards = [];
                    _b.label = 1;
                case 1:
                    if (!keepGoing) return [3 /*break*/, 5];
                    return [4 /*yield*/, getBaseConfig({
                            name: undefined,
                            resource: undefined,
                            cost: undefined,
                            points: undefined,
                            type: undefined,
                            boostDrawCount: undefined,
                            marketBoost: undefined
                        })];
                case 2:
                    card = _b.sent();
                    // production config
                    _a = card;
                    return [4 /*yield*/, getProductionConfig()];
                case 3:
                    // production config
                    _a.productionConfig = _b.sent();
                    cards.push(card);
                    return [4 /*yield*/, prompts({
                            type: "toggle",
                            message: "Keep going?",
                            name: "value",
                            active: "yes",
                            inactive: "no"
                        })];
                case 4:
                    (keepGoing = (_b.sent()).value);
                    return [3 /*break*/, 1];
                case 5:
                    sortedCards = lodash_1.sortBy(cards, "name");
                    typescriptCards = convertToTypescript(sortedCards);
                    fs_1.writeFileSync("cards-" + new Date() + ".ts", typescriptCards);
                    process.exit();
                    return [2 /*return*/];
            }
        });
    });
}
function getBaseConfig(baseConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, buildingType, myResource, cost, chosenPoints, isSunny, boostDrawCount, marketBoost;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = baseConfig;
                    return [4 /*yield*/, prompts({
                            type: "text",
                            message: "type name",
                            name: "value"
                        })];
                case 1:
                    // Building name
                    (_a.name = (_b.sent()).value);
                    return [4 /*yield*/, prompts({
                            type: "select",
                            message: "type",
                            name: "value",
                            choices: Object.entries(types_1.BuildingType).map(function (_a) {
                                var k = _a[0], v = _a[1];
                                return ({
                                    title: v,
                                    value: k
                                });
                            })
                        })];
                case 2:
                    buildingType = (_b.sent()).value;
                    baseConfig.type = buildingType;
                    return [4 /*yield*/, prompts({
                            type: "select",
                            message: "resource type",
                            name: "value",
                            choices: Object.entries(resources_1.resourceRecords).map(function (_a) {
                                var k = _a[0], v = _a[1];
                                return ({
                                    title: k,
                                    value: v
                                });
                            })
                        })];
                case 3:
                    myResource = (_b.sent()).value;
                    baseConfig.resource = myResource;
                    return [4 /*yield*/, prompts({
                            type: "number",
                            message: "how much does it cost",
                            name: "value"
                        })];
                case 4:
                    cost = (_b.sent()).value;
                    baseConfig.cost = cost;
                    return [4 /*yield*/, prompts({
                            type: "number",
                            message: "how much is it worth at the end of the game",
                            name: "value"
                        })];
                case 5:
                    chosenPoints = (_b.sent()).value;
                    baseConfig.points = chosenPoints;
                    return [4 /*yield*/, prompts({
                            type: "toggle",
                            message: "Is the card sunny?",
                            name: "value",
                            active: "yes",
                            inactive: "no"
                        })];
                case 6:
                    isSunny = (_b.sent()).value;
                    if (isSunny)
                        baseConfig.isSunny = isSunny;
                    return [4 /*yield*/, prompts({
                            type: "number",
                            message: "Boost draw count",
                            name: "value"
                        })];
                case 7:
                    boostDrawCount = (_b.sent()).value;
                    if (boostDrawCount)
                        baseConfig.boostDrawCount = boostDrawCount;
                    return [4 /*yield*/, prompts({
                            type: "multiselect",
                            message: "Boost market resources",
                            name: "value",
                            choices: Object.entries(resources_1.resourceRecords).map(function (_a) {
                                var k = _a[0], v = _a[1];
                                return ({
                                    title: k,
                                    value: v
                                });
                            })
                        })];
                case 8:
                    marketBoost = (_b.sent()).value;
                    if (marketBoost && marketBoost.length)
                        baseConfig.marketBoost = marketBoost;
                    return [2 /*return*/, baseConfig];
            }
        });
    });
}
function getProductionConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var isProducing, productionConfig, moreInput, input, moreOutput, output, isChainable, moreChainInput, chainInput;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, prompts({
                        type: "toggle",
                        message: "Is the card producing?",
                        name: "value",
                        active: "yes",
                        inactive: "no"
                    })];
                case 1:
                    isProducing = (_d.sent()).value;
                    if (!isProducing)
                        return [2 /*return*/, undefined];
                    productionConfig = {
                        output: [],
                        input: [],
                        chainInput: undefined
                    };
                    moreInput = true;
                    _d.label = 2;
                case 2:
                    if (!moreInput) return [3 /*break*/, 4];
                    return [4 /*yield*/, prompts({
                            type: "multiselect",
                            message: "resources required for input",
                            name: "value",
                            choices: Object.entries(resources_1.resourceRecords).map(function (_a) {
                                var k = _a[0], v = _a[1];
                                return ({
                                    title: k,
                                    value: v
                                });
                            })
                        })];
                case 3:
                    input = (_d.sent()).value;
                    if (input && input.length)
                        (_a = productionConfig.input).push.apply(_a, input);
                    else
                        moreInput = false;
                    return [3 /*break*/, 2];
                case 4:
                    moreOutput = true;
                    _d.label = 5;
                case 5:
                    if (!moreOutput) return [3 /*break*/, 7];
                    return [4 /*yield*/, prompts({
                            type: "multiselect",
                            message: "resources output by the building",
                            name: "value",
                            choices: Object.entries(resources_1.resourceRecords).map(function (_a) {
                                var k = _a[0], v = _a[1];
                                return ({
                                    title: k,
                                    value: v
                                });
                            })
                        })];
                case 6:
                    output = (_d.sent()).value;
                    if (output && output.length)
                        (_b = productionConfig.output).push.apply(_b, output);
                    else
                        moreOutput = false;
                    return [3 /*break*/, 5];
                case 7: return [4 /*yield*/, prompts({
                        type: "toggle",
                        message: "Is the card chainable?",
                        name: "value",
                        active: "yes",
                        inactive: "no"
                    })];
                case 8:
                    isChainable = (_d.sent()).value;
                    if (!isChainable)
                        return [2 /*return*/, productionConfig];
                    productionConfig.chainInput = [];
                    moreChainInput = true;
                    _d.label = 9;
                case 9:
                    if (!moreChainInput) return [3 /*break*/, 11];
                    return [4 /*yield*/, prompts({
                            type: "multiselect",
                            message: "which resources are required to chain the input",
                            name: "value",
                            choices: Object.entries(resources_1.resourceRecords).map(function (_a) {
                                var k = _a[0], v = _a[1];
                                return ({
                                    title: k,
                                    value: v
                                });
                            })
                        })];
                case 10:
                    chainInput = (_d.sent()).value;
                    if (chainInput && chainInput.length)
                        (_c = productionConfig.chainInput).push.apply(_c, chainInput);
                    else
                        moreChainInput = false;
                    return [3 /*break*/, 9];
                case 11: return [2 /*return*/, productionConfig];
            }
        });
    });
}
function convertToTypescript(cards) {
    return cards
        .map(function (card) {
        var _a, _b;
        var typescriptCard = lodash_1.cloneDeep(card);
        typescriptCard.type = "BuildingType." + types_1.BuildingType[card.type];
        typescriptCard.resource = card.resource.type;
        typescriptCard.marketBoost = (_a = card.marketBoost) === null || _a === void 0 ? void 0 : _a.map(function (resource) { return resource.type; });
        if (card.productionConfig) {
            typescriptCard.productionConfig = {
                input: card.productionConfig.input.map(function (resource) { return resource.type; }),
                output: card.productionConfig.output.map(function (resource) { return resource.type; }),
                chainInput: (_b = card.productionConfig.chainInput) === null || _b === void 0 ? void 0 : _b.map(function (resource) { return resource.type; })
            };
        }
        return "export const " + camelize(typescriptCard.name) + ": Card = " + JSON.stringify(typescriptCard);
    })
        .join("\n");
}
function camelize(str) {
    var arr = str.split("-");
    var capital = arr.map(function (item, index) {
        return index
            ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
            : item.toLowerCase();
    });
    // ^-- change here.
    var capitalString = capital.join("");
    return capitalString;
}
main();
//# sourceMappingURL=card-generator.js.map