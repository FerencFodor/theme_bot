import { Discord, Permission, Slash, SlashGroup, SlashOption } from 'discordx';
import { CommandInteraction } from 'discord.js';
import { nullOrZero, toTitleCase } from '../common';
import { getConnection, Repository } from 'typeorm';
import { Theme } from '../entities/theme';
import { permissions }  from '../configs/config.json';
import {randomInt} from 'crypto';

@Discord()
@SlashGroup('theme', 'themes related commands')
export abstract class DiscordApp {
  @Slash('add')
    async addTheme(
    @SlashOption('theme', { description: 'theme you want to submit' })
        text: string,
        interaction: CommandInteraction
    ) {
        text = toTitleCase(text);

        const exists = await getConnection()
            .createQueryBuilder(Theme, 'themes')
            .where('themes.theme = :theme', { theme: text })
            .getOne();

        if (exists) {
            return interaction.reply(
                `Sorry, the theme ${text} has already been submitted.`
            );
        }

        const setTheme = await Theme.create({ theme: text });
        await getConnection().getRepository(Theme).save(setTheme);
        await interaction.reply(`Thank you for submitting the theme: ${text}!`);

        console.dir(setTheme);
    }

  @Permission(false)
  @Permission([
      {id: permissions[1].id, type: 'ROLE', permission: true},
      {id: permissions[0].id, type: 'ROLE', permission: true}
  ])
  @Slash('select')
  async selectTheme(
    @SlashOption('count', {
        description: 'how many themes should be shown',
        required: false,
    })
        count: number,
        interaction: CommandInteraction
  ) {
      count = nullOrZero(count, 3);

      const themes: Theme[] = await getConnection()
          .createQueryBuilder(Theme, 'themes')
          .getMany();

      while (themes.length > count) {
          const index = randomInt(0, themes.length);
          themes.splice(index, 1);
      }

      await interaction.reply(
          `The chosen themes are: **${themes
              .map((s) => {
                  return s.theme;
              })
              .join('**, **')}**`
      );
  }

  @Permission(false)
  @Permission([
      {id: permissions[1].id, type: 'ROLE', permission: true},
      {id: permissions[0].id, type: 'ROLE', permission: true}
  ])
  @Slash('list')
  async listTheme(
    @SlashOption('page', {
        description: 'show the pages content',
        required: false,
    })
        page: number,
        interaction: CommandInteraction
  ) {
      page = nullOrZero(page, 1);

      const [themes, count] = await getConnection().getRepository(Theme).findAndCount();

      const totalPages = Math.ceil(count / 10);

      const list: Theme[] = themes.slice(10 * (page - 1), 10 * page);

      await interaction.reply(
          list
              .map((value) => {
                  return value.theme;
              }).join('\n')
          + `\n*[${page}/${totalPages}]*`
      );
  }

  @Permission(false)
  @Permission([
      {id: permissions[1].id, type: 'ROLE', permission: true},
      {id: permissions[0].id, type: 'ROLE', permission: true}
  ])
  @Slash('remove')
  async removeTheme(
    @SlashOption('theme', { description: 'theme that will be removed' })
        text: string,
        interaction: CommandInteraction
  ) {
      text = toTitleCase(text);

      const repo: Repository<Theme> = getConnection().getRepository(Theme);

      const exists = await repo.findOne({ theme: text });

      if (exists) {
          await repo.delete({ theme: text });

          await interaction.reply(`Theme ${text} has been removed.`);
      } else {
          await interaction.reply('Theme does not exists.');
      }
  }
}
