import {Client} from "@typeit/discord";
import { Intents } from "discord.js";
import { config } from "dotenv";
import { join } from "path";
import { createConnection, Connection } from "typeorm";
import Theme from './entity/theme';

config({path: join(process.cwd(), '.env')});


abstract class main {

    private static _client: Client;

    static get Client(): Client {
        return this._client;
    }

    static async start() {

        this._client = new Client({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES
            ],
            slashGuilds: [
                "851872708781146154",
                "741533650176442370"
            ],
            classes: [
                `${__dirname}/discords/*.ts`,
                `${__dirname}/discords/*.js`
            ],
            silent: false,
        });


        this._client.once('ready', async () => {
            await this._client.clearSlashes();
            await this._client.clearSlashes("851872708781146154");
            await this._client.clearSlashes("741533650176442370")
            await this._client.initSlashes();
        });

        this._client.on('interaction', (interaction) => {
            this._client.executeSlash(interaction).catch((err) => console.error(err));
        });

        _conn = await createConnection({
            type: "postgres",
            url: process.env.DATABASE_URL,
            ssl:{
                rejectUnauthorized:false
            },
            synchronize: true,
            logging: true,
            entities: [
                "build/entity/*.js",
                "src/entity/*.ts"
            ]
        });

        this._client.login(
            process.env.token
        );
    }
}

export let _conn: Connection;


main.start();



