import type { CommandInteraction, GuildMember } from "discord.js";
import type { GuardFunction } from "discordx";

import { Moderator } from "../config/config.js";

export const NotAdmin: GuardFunction<CommandInteraction> = async (
  interaction: CommandInteraction,
  client,
  next
) => {
  const user = interaction.member as GuildMember;
  if (user?.roles.cache.hasAny(...Moderator)) {
    return next();
  }
  await interaction.reply({
    ephemeral: true,
    content: "You do not have the permissions to use this command!",
  });
};
