"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermission = exports.toTitleCase = void 0;
var discord_js_1 = require("discord.js");
var config = require("../config/config.json");
function toTitleCase(text) {
    return text.toLowerCase()
        .split(' ')
        .map(function (s) { return s.charAt(0).toUpperCase() + s.substring(1); })
        .join(' ');
}
exports.toTitleCase = toTitleCase;
function checkPermission(interaction) {
    if (interaction.member instanceof discord_js_1.GuildMember)
        if (interaction.member.roles.cache.find(function (role) { return config.admins.includes(role.id); }) === undefined) {
            interaction.reply("sorry, you're not permitted to use this command");
            return false;
        }
    return true;
}
exports.checkPermission = checkPermission;
//# sourceMappingURL=support.js.map