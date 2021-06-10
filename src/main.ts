import {Client} from "@typeit/discord";
import * as pg from "pg";
import { Intents } from "discord.js";
import * as dotenv from "dotenv";

export class main {
    private static _client: Client;
    private static _dbClient: pg.Client;
    private _jsonData: {number, string};

    static get Client(): Client {
        return this._client;
    }

    static get DBClient(): pg.Client {
        return this._dbClient;
    }

    static start() {
        dotenv.config();

        this._dbClient = new pg.Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });

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

        this._dbClient.connect();

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
            process.env.token
        );
    }
}

main.start();



