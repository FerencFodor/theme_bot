"use strict";
var DiscordApp_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_1 = require("@typeit/discord");
const discord_js_1 = require("discord.js");
const config = require("../config/config.json");
const fs = require("fs");
const crypto_1 = require("crypto");
let DiscordApp = DiscordApp_1 = class DiscordApp {
    theme(text, interaction) {
        text = DiscordApp_1.toTitleCase(text);
        try {
            const data = fs.readFileSync(config.theme);
            const file = data.toString();
            const themeList = file.length > 0 ? file.split("\r") : [];
            themeList.push(text);
            fs.writeFileSync(config.theme, themeList.join('\r'));
        }
        catch (err) {
            console.error(err);
        }
        interaction.reply(`Thank you for submitting the theme: ${text}!`);
    }
    generate(x, interaction) {
        if (!this.checkPermission(interaction))
            return;
        x = x > 0 ? x : 3;
        try {
            const data = fs.readFileSync(config.theme);
            const file = data.toString();
            if (file.length == 0) {
                interaction.reply(`Oh no! There are no themes!`);
                return;
            }
            const list = file.split("\r");
            if (list.length > x) {
                while (list.length > x) {
                    let randomIndex = crypto_1.randomInt(list.length - 1);
                    list.splice(randomIndex, 1);
                }
            }
            interaction.reply(`I have chosen: ${list.join(", ")}`);
        }
        catch (err) {
            console.error(err);
        }
    }
    remove(text, interaction) {
        if (!this.checkPermission(interaction))
            return;
        text = DiscordApp_1.toTitleCase(text);
        try {
            const data = fs.readFileSync(config.theme);
            const file = data.toString();
            if (file.length == 0) {
                interaction.reply(`Oh no! There are no themes!`);
                return;
            }
            const list = file.split("\r");
            let index = list.indexOf(text);
            if (index >= 0) {
                list.splice(index, 1);
                fs.writeFileSync(config.theme, list.join('\r'));
                interaction.reply(`${text} removed!`);
            }
            else {
                interaction.reply(`${text} was not found`);
            }
        }
        catch (err) {
            console.error(err);
        }
    }
    format(interaction) {
        if (!this.checkPermission(interaction))
            return;
        try {
            const data = fs.readFileSync(config.theme);
            const file = data.toString();
            if (file.length == 0) {
                interaction.reply(`Oh no! There are no themes!`);
                return;
            }
            const list = file.split("\r");
            for (let i = 0; i < list.length; i++) {
                list[i] = DiscordApp_1.toTitleCase(list[i]);
            }
            fs.writeFileSync(config.theme, list.join('\r'));
            interaction.reply("List was formatted!");
        }
        catch (err) {
            console.error(err);
        }
    }
    ntr(interaction) {
        if (!this.checkPermission(interaction))
            return;
        try {
            const data = fs.readFileSync(config.theme);
            const file = data.toString();
            const list = file.split("\n");
            fs.writeFileSync(config.theme, list.join('\r'));
            interaction.reply("done");
        }
        catch (err) {
            console.error(err);
        }
    }
    //Private checks
    static toTitleCase(text) {
        return text.toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
    }
    checkPermission(interaction) {
        if (interaction.member instanceof discord_js_1.GuildMember)
            if (interaction.member.roles.cache.find(role => config.admins.includes(role.id)) === undefined) {
                interaction.reply("sorry, you're not permitted to use this command");
                return false;
            }
        return true;
    }
};
tslib_1.__decorate([
    discord_1.Slash("theme"),
    tslib_1.__param(0, discord_1.Option("message", { description: "theme you want to submit", required: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, discord_js_1.CommandInteraction]),
    tslib_1.__metadata("design:returntype", void 0)
], DiscordApp.prototype, "theme", null);
tslib_1.__decorate([
    discord_1.Permission(config.admins[0], "ROLE"),
    discord_1.Permission(config.admins[1], "ROLE"),
    discord_1.Slash("generate"),
    tslib_1.__param(0, discord_1.Option("max", { description: "how many items should it show" })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, discord_js_1.CommandInteraction]),
    tslib_1.__metadata("design:returntype", void 0)
], DiscordApp.prototype, "generate", null);
tslib_1.__decorate([
    discord_1.Permission(config.admins[0], "ROLE"),
    discord_1.Permission(config.admins[1], "ROLE"),
    discord_1.Slash("remove"),
    tslib_1.__param(0, discord_1.Option("theme", { description: "theme that you want to remove", required: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, discord_js_1.CommandInteraction]),
    tslib_1.__metadata("design:returntype", void 0)
], DiscordApp.prototype, "remove", null);
tslib_1.__decorate([
    discord_1.Permission(config.admins[0], "ROLE"),
    discord_1.Permission(config.admins[1], "ROLE"),
    discord_1.Slash("format"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    tslib_1.__metadata("design:returntype", void 0)
], DiscordApp.prototype, "format", null);
tslib_1.__decorate([
    discord_1.Permission(config.admins[0], "ROLE"),
    discord_1.Permission(config.admins[1], "ROLE"),
    discord_1.Slash("nextToReturn"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    tslib_1.__metadata("design:returntype", void 0)
], DiscordApp.prototype, "ntr", null);
DiscordApp = DiscordApp_1 = tslib_1.__decorate([
    discord_1.Discord()
], DiscordApp);
//# sourceMappingURL=DiscordApp.js.map