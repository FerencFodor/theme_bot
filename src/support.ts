import {CommandInteraction, GuildMember} from 'discord.js';
import * as cfg from './config/config.json';

export function toTitleCase(text: string): string {
    return text.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
}

export function checkPermission(interaction: CommandInteraction): boolean {
    const member = interaction.member;

    if(member instanceof GuildMember){
        return member.roles.cache.some(r => cfg.admins.includes(r.id));
    }
    return false;
}