"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._conn = void 0;
var tslib_1 = require("tslib");
var discord_1 = require("@typeit/discord");
var discord_js_1 = require("discord.js");
var dotenv_1 = require("dotenv");
var path_1 = require("path");
var typeorm_1 = require("typeorm");
dotenv_1.config({ path: path_1.join(process.cwd(), '.env') });
var main = /** @class */ (function () {
    function main() {
    }
    Object.defineProperty(main, "Client", {
        get: function () {
            return this._client;
        },
        enumerable: false,
        configurable: true
    });
    main.start = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._client = new discord_1.Client({
                            intents: [
                                discord_js_1.Intents.FLAGS.GUILDS,
                                discord_js_1.Intents.FLAGS.GUILD_MESSAGES
                            ],
                            slashGuilds: [
                                "851872708781146154",
                                "741533650176442370"
                            ],
                            classes: [
                                __dirname + "/discords/*.ts",
                                __dirname + "/discords/*.js"
                            ],
                            silent: false,
                        });
                        this._client.once('ready', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this._client.clearSlashes()];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, this._client.clearSlashes("851872708781146154")];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, this._client.clearSlashes("741533650176442370")];
                                    case 3:
                                        _a.sent();
                                        return [4 /*yield*/, this._client.initSlashes()];
                                    case 4:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        this._client.on('interaction', function (interaction) {
                            _this._client.executeSlash(interaction).catch(function (err) { return console.error(err); });
                        });
                        return [4 /*yield*/, typeorm_1.createConnection({
                                type: "postgres",
                                url: process.env.DATABASE_URL,
                                ssl: {
                                    rejectUnauthorized: false
                                },
                                synchronize: true,
                                logging: true,
                                entities: [
                                    "build/entity/*.js",
                                    "src/entity/*.ts"
                                ]
                            })];
                    case 1:
                        exports._conn = _a.sent();
                        this._client.login(process.env.token);
                        return [2 /*return*/];
                }
            });
        });
    };
    return main;
}());
main.start();
//# sourceMappingURL=main.js.map