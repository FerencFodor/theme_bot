import {Discord, Group, Guard, Option, Slash} from '@typeit/discord';
import { CommandInteraction} from 'discord.js';
import { toTitleCase } from '../support';
import {randomInt} from 'crypto';
import {Theme} from '../entity/theme';
import {getConnection} from 'typeorm';
import {Admin} from '../guard/admin';

@Discord()
@Group('themes')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
abstract class DiscordApp {

    @Slash('add')
    async addTheme(@Option('theme', {description: 'theme you want to submit', required: true})text: string,
        interaction: CommandInteraction){

        text = toTitleCase(text);
        const exists = await getConnection()
            .createQueryBuilder(Theme, 'themes')
            .where('themes.theme = :theme', {theme: text})
            .getOne();

        if(exists){
            return interaction.reply(`Sorry, the theme ${text} has already been submitted.`);
        }

        const setTheme = await Theme.create({theme: text});
        await getConnection().getRepository(Theme).save(setTheme);
        console.dir(setTheme);
        await interaction.reply(`Thank you for submitting the theme: ${text}!`);
    }

	@Slash('select')
	@Guard(Admin)
    async generate(@Option('count', {description: 'how many themes should it select'}) count: number, interaction: CommandInteraction) {count = count > 0 ? count : 3;
        count = count > 0 ? count : 3;

        const themes: Theme[] = await getConnection().getRepository(Theme).find();

        while (themes.length > count) {
            const randomIndex = randomInt(themes.length);
            themes.splice(randomIndex, 1);
        }

        await interaction.reply(`The chosen themes are: ${themes.map(value => {
            return value.theme;
        }).join(', ')}`);
    }

    @Slash('remove')
    @Guard(Admin)
	async remove(@Option('theme', {description: 'theme that will be removed', required: true}) text: string,
	    interaction: CommandInteraction){

	    text = toTitleCase(text);

	    const exists = await getConnection()
	        .getRepository(Theme)
	        .findOne({theme: text});

	    if(exists){
	        await getConnection()
	            .getRepository(Theme)
	            .delete({theme: text});

	        await interaction.reply(`Theme ${text} has been removed.`);
	    } else {
	        await interaction.reply('Theme does not exists.');
	    }
	}
}