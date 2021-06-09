"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const discord_1 = require("@typeit/discord");
const discord_js_1 = require("discord.js");
const token = require("./config/token.json");
class main {
    static get Client() {
        return this._client;
    }
    static start() {
        this._client = new discord_1.Client({
            intents: [
                discord_js_1.Intents.FLAGS.GUILDS,
                discord_js_1.Intents.FLAGS.GUILD_MESSAGES
            ],
            slashGuilds: ["851872708781146154", "741533650176442370"],
            classes: [
                `${__dirname}/discords/*.ts`,
                `${__dirname}/discords/*.js`
            ],
            silent: false,
        });
        this._client.once("ready", async () => {
            await this._client.clearSlashes();
            await this._client.clearSlashes("851872708781146154");
            await this._client.clearSlashes("741533650176442370");
            await this._client.initSlashes();
        });
        this._client.on("interaction", (interaction) => {
            this._client.executeSlash(interaction).catch((err) => console.error(err));
        });
        this._client.login(token.token);
    }
}
exports.main = main;
main.start();
//# sourceMappingURL=main.js.map