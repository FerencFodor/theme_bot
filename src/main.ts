import "reflect-metadata";

import { dirname, importx } from "@discordx/importer";
import { IntentsBitField } from "discord.js";
import { Client } from "discordx";
import dotenv from "dotenv";

import { AppSourceData } from "./source_data.js";

dotenv.config();

export class Main {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  static async start(): Promise<void> {
    this._client = new Client({
      intents: [
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
      ],
      silent: false,
    });

    await importx(`${dirname(import.meta.url)}/command/**/*.{js,ts}`);
    await importx(`${dirname(import.meta.url)}/entity/**/*.{js,ts}`);

    this._client.once("ready", async () => {
      await this._client.clearApplicationCommands(
        ...this._client.guilds.cache.map((guild) => guild.id)
      );
      await this._client.initApplicationCommands();

      console.log("[+] Bot started");
    });

    this._client.on("interactionCreate", (interaction) => {
      this._client.executeInteraction(interaction);
    });

    if (!process.env.TOKEN) {
      throw Error("Could not find TOKEN in your enviroment");
    }

    await AppSourceData.initialize();

    await this._client.login(process.env.TOKEN);
  }
}

Main.start()
  .then(() => console.log("[+]Bot running"))
  .catch((err) => console.error(err));
