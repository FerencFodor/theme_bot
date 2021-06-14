import { CommandInteraction, GuildMember } from "discord.js";
import * as config from "../config/config.json";

export function toTitleCase(text: string): string {
    return text.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
}

export function checkPermission(interaction: CommandInteraction): boolean{
    if(interaction.member instanceof GuildMember)
        if(interaction.member.roles.cache.find(role => config.admins.includes(role.id)) === undefined){
            interaction.reply("sorry, you're not permitted to use this command");
            return false;
        }
    return true;
}
