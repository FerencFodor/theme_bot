import type {
  CommandInteraction,
  MessageActionRowComponentBuilder,
  MessageComponentInteraction,
} from "discord.js";
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { Discord, Guard, Slash, SlashOption } from "discordx";

import { Theme } from "../entity/theme.js";
import { NotAdmin } from "../guard/admin_only.js";
import { AppSourceData } from "../source_data.js";
import { validateInput, validateNumber } from "../utility/util.js";

const themesPerPage = 10;

const button = {
  next: "next-btn",
  previous: "prev-btn",
};

@Discord()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ThemeCommands {
  repo = AppSourceData.getRepository(Theme);

  @Slash({ description: "add theme to collection" })
  async add(
    @SlashOption({
      description: "theme you want to add",
      name: "theme",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    text: string,
    interaction: CommandInteraction
  ) {
    text.trim();
    if (text.length > 255) {
      return interaction.reply("Sorry, your theme is too long.");
    }

    text = validateInput(text);

    if ((await this.repo.findOneBy({ theme: text })) != null) {
      return interaction.reply(
        `Sorry, the theme **${text}** has already been submitted.`
      );
    }

    await this.repo.insert({ theme: text });
    interaction.reply(`Thank you for submitting the theme: ${text}!`);
  }

  @Slash({ description: "remove entry from database" })
  @Guard(NotAdmin)
  async remove(
    @SlashOption({
      description: "theme you want to remove",
      name: "theme",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    text: string,
    interaction: CommandInteraction
  ) {
    text = validateInput(text);

    const exists = await this.repo.findOneBy({ theme: text });

    if (exists == null) {
      return interaction.reply({
        content: `${text} does not exists.`,
        ephemeral: true,
      });
    }

    await this.repo.remove(exists);
    interaction.reply({ content: `${text} has been removed`, ephemeral: true });
  }

  @Slash({ description: "get entries from database" })
  @Guard(NotAdmin)
  async select(
    @SlashOption({
      description: "number of theme to retrieve",
      name: "count",
      required: false,
      type: ApplicationCommandOptionType.Number,
    })
    count: number,
    interaction: CommandInteraction
  ) {
    count = validateNumber(count);

    const themes: Theme[] = await this.repo
      .createQueryBuilder("themes")
      .orderBy("RANDOM()")
      .take(count)
      .getMany();

    interaction.reply(
      `The chosen themes are: **${themes
        .map((theme) => theme.theme.trimEnd())
        .join("**, **")}**`
    );
  }

  @Slash({ description: "Show all entries" })
  async list(
    @SlashOption({
      description: "page to view",
      name: "page",
      required: false,
      type: ApplicationCommandOptionType.Number,
    })
    page: number,
    interaction: CommandInteraction
  ) {
    page = validateNumber(page);

    const numberOfThemes = await this.repo.count();
    const remaining = numberOfThemes % themesPerPage;
    const numberOfPages =
      (numberOfThemes - remaining) / themesPerPage + (remaining > 0 ? 1 : 0);

    if (page <= 0) {
      page = 1;
    } else if (page > numberOfPages) {
      page = numberOfPages;
    }

    const themes: Theme[] = await this.generatePage(page, numberOfPages);

    const previousButton = new ButtonBuilder()
      .setLabel("Previous")
      .setStyle(ButtonStyle.Primary)
      .setCustomId(button.previous);

    const nextButton = new ButtonBuilder()
      .setLabel("Next")
      .setStyle(ButtonStyle.Primary)
      .setCustomId(button.next);

    const buttonRow =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        previousButton,
        nextButton
      );
    const embeded = this.generateEmbededList(themes, page, numberOfPages);

    const embedReply = interaction.reply({
      components: [buttonRow],
      embeds: [embeded],
    });

    const filter = (i: MessageComponentInteraction) =>
      i.customId === button.previous || i.customId === button.next;

    const collector = (await embedReply).createMessageComponentCollector({
      filter,
      time: 3 * 60 * 1000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === button.next) {
        page = page++ > numberOfPages ? numberOfPages : page++;
      } else if (i.customId === button.previous) {
        page = page-- <= 0 ? 1 : page--;
      }

      buttonRow.components.forEach((b) => b.setDisabled(true));
      interaction.editReply({ components: [buttonRow] });
      await i.deferUpdate();

      await this.buttonInteraction(interaction, page, numberOfPages);
      buttonRow.components.forEach((b) => b.setDisabled(false));
      interaction.editReply({ components: [buttonRow] });
    });
  }

  async buttonInteraction(
    interaction: CommandInteraction,
    page: number,
    numberOfPages: number
  ) {
    const list = await this.generatePage(page, numberOfPages);
    const newEmbed = this.generateEmbededList(list, page, numberOfPages);
    interaction.editReply({ embeds: [newEmbed] });
  }

  generateEmbededList(themes: Theme[], page: number, numberOfPages: number) {
    return new EmbedBuilder()
      .setColor(0xb52fb5)
      .addFields({
        name: "Themes",
        value: `${themes.map((theme) => {
          return `${theme.theme}\n`;
        })}`,
      })
      .setFooter({ text: `${page}/${numberOfPages}` });
  }

  generatePage(page: number, numberOfPages: number): Promise<Theme[]> {
    const index = 1 + (page - 1) * numberOfPages;

    return this.repo
      .createQueryBuilder("themes")
      .where("themes.id >= :id", { id: index })
      .orderBy("id", "ASC")
      .limit(themesPerPage)
      .getMany();
  }
}
