"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var discord_1 = require("@typeit/discord");
var discord_js_1 = require("discord.js");
var support_1 = require("./support");
var config = require("../config/config.json");
var crypto_1 = require("crypto");
var theme_1 = require("../entity/theme");
var typeorm_1 = require("typeorm");
var DiscordApp = /** @class */ (function () {
    function DiscordApp() {
    }
    DiscordApp.prototype.addTheme = function (text, interaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var exists, setTheme;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        text = support_1.toTitleCase(text);
                        return [4 /*yield*/, typeorm_1.getConnection()
                                .createQueryBuilder(theme_1.default, 'themes')
                                .where("themes.theme = :theme", { theme: text })
                                .getOne()];
                    case 1:
                        exists = _a.sent();
                        if (exists) {
                            return [2 /*return*/, interaction.reply("Sorry, the theme " + text + " has already been submitted.")];
                        }
                        return [4 /*yield*/, theme_1.default.create({ theme: text })];
                    case 2:
                        setTheme = _a.sent();
                        return [4 /*yield*/, typeorm_1.getConnection().getRepository(theme_1.default).save(setTheme)];
                    case 3:
                        _a.sent();
                        console.dir(setTheme);
                        interaction.reply("Thank you for submitting the theme: " + text + "!");
                        return [2 /*return*/];
                }
            });
        });
    };
    DiscordApp.prototype.generate = function (x, interaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _themes, listTheme, i, randomIndex;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!support_1.checkPermission(interaction))
                            return [2 /*return*/];
                        x = x > 0 ? x : 3;
                        return [4 /*yield*/, typeorm_1.getConnection().getRepository(theme_1.default).find()];
                    case 1:
                        _themes = _a.sent();
                        listTheme = [];
                        for (i = 0; i < _themes.length; i++) {
                            listTheme.push(_themes[i].theme);
                        }
                        if (listTheme.length > x) {
                            while (listTheme.length > x) {
                                randomIndex = crypto_1.randomInt(listTheme.length - 1);
                                listTheme.splice(randomIndex, 1);
                            }
                        }
                        interaction.reply("I have chosen: " + listTheme.join(", "));
                        return [2 /*return*/];
                }
            });
        });
    };
    DiscordApp.prototype.remove = function (text, interaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var exist;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!support_1.checkPermission(interaction))
                            return [2 /*return*/];
                        text = support_1.toTitleCase(text);
                        return [4 /*yield*/, typeorm_1.getConnection()
                                .createQueryBuilder(theme_1.default, "themes")
                                .delete()
                                .from(theme_1.default, 'themes')
                                .where('theme = :theme', { theme: text })
                                .execute()];
                    case 1:
                        exist = _a.sent();
                        if (exist) {
                            interaction.reply("Theme " + text + " has been removed");
                        }
                        else {
                            interaction.reply('Theme did not exists');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    tslib_1.__decorate([
        discord_1.Slash("add"),
        tslib_1.__param(0, discord_1.Option("theme", { description: "theme you want to submit", required: true })),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String, discord_js_1.CommandInteraction]),
        tslib_1.__metadata("design:returntype", Promise)
    ], DiscordApp.prototype, "addTheme", null);
    tslib_1.__decorate([
        discord_1.Slash("generate"),
        discord_1.Permission(config.admins[0], "ROLE"),
        discord_1.Permission(config.admins[1], "ROLE"),
        tslib_1.__param(0, discord_1.Option("max", { description: "how many items should it show" })),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Number, discord_js_1.CommandInteraction]),
        tslib_1.__metadata("design:returntype", Promise)
    ], DiscordApp.prototype, "generate", null);
    tslib_1.__decorate([
        discord_1.Permission(config.admins[0], "ROLE"),
        discord_1.Permission(config.admins[1], "ROLE"),
        discord_1.Slash("remove"),
        tslib_1.__param(0, discord_1.Option("theme", { description: "theme that you want to remove", required: true })),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String, discord_js_1.CommandInteraction]),
        tslib_1.__metadata("design:returntype", Promise)
    ], DiscordApp.prototype, "remove", null);
    DiscordApp = tslib_1.__decorate([
        discord_1.Discord(),
        discord_1.Group("themes")
    ], DiscordApp);
    return DiscordApp;
}());
//# sourceMappingURL=DiscordApp.js.map