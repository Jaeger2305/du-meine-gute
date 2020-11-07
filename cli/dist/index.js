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
var game_1 = require("./game");
var local_server_1 = require("./local-server");
var types_1 = require("./types");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var game, player, step, chosenAction, serverResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    game = game_1.newGame();
                    // For the CLI variant, we're modifying the game directly.
                    // Inside of Vue, we'll be updating this via props and events.
                    local_server_1.setupGame(game);
                    player = game.players[0];
                    step = 0;
                    _a.label = 1;
                case 1:
                    if (!player.availableActions.length) return [3 /*break*/, 4];
                    // console.clear();
                    console.log("starting step", types_1.RoundSteps[(step - 1) % local_server_1.roundSteps.length]);
                    console.log("Game state: ", game, "player state", player);
                    return [4 /*yield*/, prompts({
                            type: "select",
                            message: "pick an action to perform",
                            name: "handler",
                            choices: player.availableActions.map(function (a) { return ({
                                title: a.type,
                                value: a.handler
                            }); })
                        })];
                case 2:
                    chosenAction = _a.sent();
                    // Perform the action
                    console.log("performing chosen action", chosenAction);
                    return [4 /*yield*/, chosenAction.handler(game, player)];
                case 3:
                    _a.sent();
                    // Wait for server response
                    // Local only
                    // If there are no available actions, we're waiting for input from the server
                    // In the case of a local game, we just progress to the next step in the round
                    // Currently, this assumes when there are no available actions, we're just waiting for a response.
                    if (!player.availableActions.length) {
                        serverResponse = local_server_1.roundSteps[step++ % local_server_1.roundSteps.length](game, player);
                        console.debug(serverResponse);
                    }
                    return [3 /*break*/, 1];
                case 4:
                    process.exit();
                    return [2 /*return*/];
            }
        });
    });
}
main();
//# sourceMappingURL=index.js.map