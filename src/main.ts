import { config } from 'dotenv';
import { join } from 'path';
import { Client } from '@typeit/discord';
import {Constants, Intents} from 'discord.js';
import { guilds } from './config/config.json';
import {createConnection} from 'typeorm';

config({ path: join(process.cwd(), '.env') });

abstract class main {
	private static _client: Client;

	static async start() {
	    //create connections
	    this._client = new Client({
	        intents:[
	            Intents.FLAGS.GUILDS,
	            Intents.FLAGS.GUILD_MESSAGES
	        ],
	        slashGuilds: [
	            guilds[0],
	            guilds[1]
	        ],
	        classes: [
	            `${__dirname}/discords/*.ts`,
	            `${__dirname}/discords/*.js`
	        ],
	        silent: false
	    });

	    this._client.once(Constants.Events.CLIENT_READY, async ()=>{
	        await this._client.clearSlashes();
	        await this._client.clearSlashes(guilds[0]);
	        await this._client.clearSlashes(guilds[1]);
	        await this._client.initSlashes();
	    });

	    this._client.on(Constants.Events.INTERACTION_CREATE, (interaction)=>{
	        this._client.executeSlash(interaction).catch((err) => console.error(err));
	    });

	    await createConnection({
	        type: 'postgres',
	        url: process.env.DATABASE_URL,
	        ssl: {
	            rejectUnauthorized: false
	        },
	        synchronize: true,
	        logging: true,
	        entities: [
	            `${__dirname}/entity/*.ts`,
	            `${__dirname}/entity/*.js`
	        ]
	    });

	    await this._client.login(
	        process.env.token
	    );
	}
}

main.start()
    .then(() => console.log('log in complete'))
    .catch((err) => console.error(err));