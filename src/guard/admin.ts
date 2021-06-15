import {ArgsOf, GuardFunction} from '@typeit/discord';
import * as cfg from '../config/config.json';

export const Admin: GuardFunction<ArgsOf<'interaction'>> = async (
    [interaction],
    client,
    next,
) => {
    const member = interaction.guild.members.cache.find(m => m === interaction.member);

    for (const role in cfg.admins) {
        if (member.roles.cache.find(r => r.id === role)) {
            await next();
        }
    }
};