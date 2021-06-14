import { Discord, Group, Option, Permission, Slash } from "@typeit/discord";
import { CommandInteraction, GuildMember } from "discord.js";
import { checkPermission, toTitleCase } from "./support";
import * as config from "../config/config.json";
import {randomInt} from "crypto";
import * as fs from 'fs';
import Theme from "../entity/theme";
import {getConnection, getRepository} from 'typeorm';

@Discord()
@Group("themes")
abstract class DiscordApp {

    @Slash("add")
    async addTheme(@Option("theme", {description: "theme you want to submit", required: true})text: string,
                interaction: CommandInteraction){

        text = toTitleCase(text);
        const exists = await getConnection()
            .createQueryBuilder(Theme, 'themes')
            .where("themes.theme = :theme", {theme: text})
            .getOne();

        if(exists){
            return interaction.reply(`Sorry, the theme ${text} has already been submitted.`);
        }

        const setTheme = await Theme.create({theme: text});
        await getConnection().getRepository(Theme).save(setTheme);
        console.dir(setTheme);
        interaction.reply(`Thank you for submitting the theme: ${text}!`);
    }


    @Slash("generate")
    @Permission(config.admins[0], "ROLE")
    @Permission(config.admins[1], "ROLE")
    async generate(@Option("max", {description: "how many items should it show"}) x: number,
             interaction: CommandInteraction){

        if(!checkPermission(interaction))
            return;

        x = x > 0 ? x : 3;

        const _themes: Theme[] = await getConnection().getRepository(Theme).find();
        let listTheme: string[] = [];

        for(let i: number = 0; i < _themes.length; i++){
            listTheme.push(_themes[i].theme);
        }

        if(listTheme.length > x){
            while (listTheme.length > x) {
                let randomIndex = randomInt(listTheme.length-1);
                listTheme.splice(randomIndex,1);
            }
        }

        interaction.reply(`I have chosen: ${listTheme.join(", ")}`);
    }

    @Permission(config.admins[0], "ROLE")
    @Permission(config.admins[1], "ROLE")
    @Slash("remove")
    async remove(@Option("theme", {description: "theme that you want to remove", required: true}) text: string,
           interaction: CommandInteraction){

        if(!checkPermission(interaction))
            return;

        text = toTitleCase(text);


        const exist = await getConnection()
            .createQueryBuilder(Theme, "themes")
            .delete()
            .from(Theme, 'themes')
            .where('theme = :theme', {theme: text})
            .execute();


        if(exist){
            interaction.reply(`Theme ${text} has been removed`);
        } else {
            interaction.reply('Theme did not exists');
        }
    }
}