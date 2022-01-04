import { config } from 'dotenv';
import { join } from 'path';
import { Client } from 'discordx';
import { importx } from '@discordx/importer';
import { Constants, Intents } from 'discord.js';
import {Connection, createConnection} from 'typeorm';

config({ path: join(process.cwd(), '.env') });

abstract class Main {
    private static _client: Client;

    private static _conn: Connection;

    static get Client(): Client {
        return this._client;
    }

    static get Connection(): Connection {
        return this._conn;
    }

    static async start(): Promise<void> {
        this._client = new Client({
            botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MEMBERS,
            ],
        });

        this._client.once(Constants.Events.CLIENT_READY, async () => {
            await this._client.initApplicationCommands({
                global: { log: true },
                guild: { log: true },
            });
            await this._client.initApplicationPermissions(true);

            console.log('[+] Bot Initialized');
        });

        this._client.on(Constants.Events.INTERACTION_CREATE, (interaction) => {
            this._client.executeInteraction(interaction);
        });

        this._conn = await createConnection({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false,
            },
            synchronize: true,
            logging: true,
            entities: [`${__dirname}/entities/*.ts`, `${__dirname}/entities/*.js`],
        });

        await importx(__dirname + '/discords/*.{js,ts}');
        await this._client.login(process.env.token ?? '');
    }
}

Main.start()
    .then(() => console.log('[+] Login Complete'))
    .catch((err) => console.error(err));
