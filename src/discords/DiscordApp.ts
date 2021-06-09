import {Discord, Option, Permission, Slash} from "@typeit/discord";
import {CommandInteraction, GuildMember } from "discord.js";
import * as config from "../config/config.json";
import * as fs from 'fs';
import {randomInt} from "crypto";

@Discord()
abstract class DiscordApp {

    @Slash("theme")
    theme(
        @Option("message", {description: "theme you want to submit", required: true})text: string,
        interaction: CommandInteraction){

        text = DiscordApp.toTitleCase(text);

        try {
            const data: Buffer = fs.readFileSync(config.theme);
            const file: string = data.toString();
            const themeList: string[] = file.length > 0 ? file.split("\r") : [];

            themeList.push(text);

            fs.writeFileSync(config.theme ,themeList.join('\r'));
        } catch (err) {
            console.error(err);
        }

        interaction.reply(`Thank you for submitting the theme: ${text}!`);
    }

    @Permission(config.admins[0], "ROLE")
    @Permission(config.admins[1], "ROLE")
    @Slash("generate")
    generate(@Option("max", {description: "how many items should it show"}) x: number,
             interaction: CommandInteraction){

        if(!this.checkPermission(interaction))
            return;

        x = x > 0 ? x : 3;

        try{
            const data: Buffer = fs.readFileSync(config.theme);
            const file: string =  data.toString();
            if(file.length == 0) {
                interaction.reply(`Oh no! There are no themes!`);
                return;
            }

            const list: string[] = file.split("\r");
            if(list.length > x){
                while (list.length > x) {
                    let randomIndex = randomInt(list.length-1);
                    list.splice(randomIndex,1);
                }
            }

            interaction.reply(`I have chosen: ${list.join(", ")}`);
        } catch (err){
            console.error(err);
        }
    }

    @Permission(config.admins[0], "ROLE")
    @Permission(config.admins[1], "ROLE")
    @Slash("remove")
    remove(@Option("theme", {description: "theme that you want to remove", required: true}) text: string,
           interaction: CommandInteraction){

        if(!this.checkPermission(interaction))
            return;

        text = DiscordApp.toTitleCase(text);
        try {
            const data: Buffer = fs.readFileSync(config.theme);
            const file: string =  data.toString();
            if(file.length == 0) {
                interaction.reply(`Oh no! There are no themes!`);
                return;
            }

            const list: string[] = file.split("\r");
            let index: number = list.indexOf(text);
            if(index >= 0){
                list.splice(index, 1);
                fs.writeFileSync(config.theme ,list.join('\r'));
                interaction.reply(`${text} removed!`);
            } else {
                interaction.reply(`${text} was not found`)
            }


        } catch (err){
            console.error(err);
        }
    }

    @Permission(config.admins[0], "ROLE")
    @Permission(config.admins[1], "ROLE")
    @Slash("format")
    format(
           interaction: CommandInteraction){

        if(!this.checkPermission(interaction))
            return;

        try {
            const data: Buffer = fs.readFileSync(config.theme);
            const file: string =  data.toString();
            if(file.length == 0) {
                interaction.reply(`Oh no! There are no themes!`);
                return;
            }

            const list: string[] = file.split("\r");

            for(let i = 0; i < list.length; i++) {
                list[i] = DiscordApp.toTitleCase(list[i]);
            }

            fs.writeFileSync(config.theme ,list.join('\r'));
            interaction.reply("List was formatted!");

        } catch (err){
            console.error(err);
        }
    }
    @Permission(config.admins[0], "ROLE")
    @Permission(config.admins[1], "ROLE")
    @Slash("nextToReturn")
    ntr(interaction: CommandInteraction){

        if(!this.checkPermission(interaction))
            return;

        try {
            const data: Buffer = fs.readFileSync(config.theme);
            const file: string =  data.toString();

            const list: string[] = file.split("\n");

            fs.writeFileSync(config.theme ,list.join('\r'));
            interaction.reply("done");

        } catch (err){
            console.error(err);
        }
    }

    //Private checks
    private static toTitleCase(text: string): string {
        return text.toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
    }

    checkPermission(interaction: CommandInteraction): boolean{
        if(interaction.member instanceof GuildMember)
            if(interaction.member.roles.cache.find(role => config.admins.includes(role.id)) === undefined){
                interaction.reply("sorry, you're not permitted to use this command");
                return false;
            }
        return true;
    }
}