import {Client} from "@typeit/discord";
import { Intents } from "discord.js";

import dotenv from "dotenv";

export class main {
    private static _client: Client;


    static get Client(): Client {
        return this._client;
    }

    static start() {
        dotenv.config({path: "../.env"});
        let token = process.env["token"];

        this._client = new Client({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES
            ],
            slashGuilds: ["851872708781146154", "741533650176442370"],
            classes: [
                `${__dirname}/discords/*.ts`,
                `${__dirname}/discords/*.js`
            ],
            silent:false,
        });

        this._client.once("ready", async () => {
            await this._client.clearSlashes();
            await this._client.clearSlashes("851872708781146154");
            await this._client.clearSlashes("741533650176442370")
            await this._client.initSlashes();
        });

        this._client.on("interaction", (interaction) => {

           this._client.executeSlash(interaction).catch((err) => console.error(err));
        });

         this._client.login(
            token
        );
    }
}

main.start();



