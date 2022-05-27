import "reflect-metadata";

import { dirname, importx } from "@discordx/importer";
import type { Interaction } from "discord.js";
import { Constants, Intents } from "discord.js";
import { Client } from "discordx";
import dotenv from "dotenv";

import { AppSourceData } from "./source_data.js";

dotenv.config();

export const bot: Client = new Client({
  botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],

  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],

  silent: false,
});

bot.once(Constants.Events.CLIENT_READY, async () => {
  await bot.guilds.fetch();
  await bot.clearApplicationCommands();
  await bot.initApplicationCommands();
  await bot.initApplicationPermissions();

  console.log("[+] Bot Started");
});

bot.on(Constants.Events.INTERACTION_CREATE, (interaction: Interaction) => {
  bot.executeInteraction(interaction);
});

async function run() {
  await importx(dirname(import.meta.url) + "/{event,command}/**/*.{ts,js}");

  if (!process.env.TOKEN) {
    throw Error("Could not find TOKEN in your environment");
  }

  await AppSourceData.initialize();

  await bot.login(process.env.TOKEN);
}

run()
  .then(() => console.log("[+]Bot running"))
  .catch((err) => console.error(err));
