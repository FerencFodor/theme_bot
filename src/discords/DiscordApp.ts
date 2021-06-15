import {Discord, Group, /*Guard,*/ Option, Slash} from '@typeit/discord';
import {CommandInteraction} from 'discord.js';
import {checkPermission, toTitleCase} from '../support';
import {randomInt} from 'crypto';
import {Theme} from '../entity/theme';
import {getConnection} from 'typeorm';
//import {Admin} from '../guard/admin';

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
	//@Guard(Admin)
    async generate(@Option('count', {description: 'how many themes should it select'}) count: number, interaction: CommandInteraction) {

    	if(!checkPermission(interaction))
            return;

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

    @Slash('list')
    //@Guard(Admin)
	async listThemes(@Option('page', {description: 'show the pages content, min. 1'}) page: number,
	    interaction: CommandInteraction){

    	if(!checkPermission(interaction))
    		return;

    	const [themes, count] = await getConnection()
		    .getRepository(Theme)
		    .findAndCount();

    	const totalPages = Math.ceil(count/10);

	    page = page > 0 ? page : 1;
	    page = page > totalPages ? totalPages: page;

    	const list: Theme[] = themes.slice(10*(page-1), (10)*page -1);

    	await interaction.reply(list.map(value => {return value.theme;}).join('\n') + `\n*[${page}/${totalPages}]*`);
	}

    @Slash('remove')
    //@Guard(Admin)
    async remove(@Option('theme', {description: 'theme that will be removed', required: true}) text: string,
	    interaction: CommandInteraction){

	    if(!checkPermission(interaction))
		    return;

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