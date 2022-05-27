import type { MessageComponentInteraction } from "discord.js";
import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import { ButtonComponent, Discord, Guard, Slash, SlashOption } from "discordx";
import type { Repository } from "typeorm";

import { Theme } from "../entity/theme.js";
import { NotAdmin } from "../guard/admin_only.js";
import { AppSourceData } from "../source_data.js";
import {
  getPageIndex,
  getReply,
  isNullOfUndefined,
  nullOrZero,
} from "../utility/util.js";

const button = {
  previous: "prev-btn",
  next: "next-btn",
};

const pageSize = 10;

@Discord()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
abstract class themeCommand {
  @Slash("add")
  async addTheme(
    @SlashOption("theme", {
      description: "theme you want to submit",
      required: true,
    })
    text: string,
    interaction: CommandInteraction
  ) {
    if (text.length > 255) {
      return interaction.reply("Sorry, your theme is too long.");
    }

    text = text.toTitleCase();

    const data = AppSourceData.getRepository(Theme);

    if ((await data.findOneBy({ theme: text })) != null) {
      return interaction.reply(
        `Sorry, the theme **${text}** has already been submitted`
      );
    }

    await data.insert({ theme: text });
    await interaction.reply(`Thank you for submitting the theme: ${text}!`);
  }

  @Slash("remove")
  @Guard(NotAdmin)
  async removeTheme(
    @SlashOption("theme", {
      description: "theme you want to remove",
      required: true,
    })
    text: string,
    interaction: CommandInteraction
  ) {
    text = text.toTitleCase();
    const data = AppSourceData.getRepository(Theme);

    const exists = await data.findOneBy({ theme: text });

    if (exists == null) {
      return interaction.reply(`The theme ${text} does not exists`);
    }

    await data.remove(exists);
    return interaction.reply(`${text} has been removed`);
  }

  @Slash("select")
  @Guard(NotAdmin)
  async selectThemes(
    @SlashOption("count", {
      description: "how many themes to select",
      required: false,
    })
    count: number,
    interaction: CommandInteraction
  ) {
    count = nullOrZero(count, 3);

    const data = AppSourceData.getRepository(Theme);

    const themes: Theme[] = await data
      .createQueryBuilder("themes")
      .orderBy("random()")
      .take(count)
      .getMany();

    return interaction.reply(
      `The chosen themes are: **${themes
        .map((s) => {
          return s.theme.trimEnd();
        })
        .join("**, **")}**`
    );
  }

  @Slash("list")
  async ListTheme(
    @SlashOption("page", {
      description: "number of page to see",
      required: false,
    })
    page: number,
    interaction: CommandInteraction
  ) {
    page = nullOrZero(page, 1);
    const data = AppSourceData.getRepository(Theme);

    // get page and limit

    const themeCount: number = await data.count();
    const rem: number = themeCount % pageSize;
    const pageCount: number = (themeCount - rem) / pageSize + (rem > 0 ? 1 : 0);

    if (page <= 0) {
      page = 1;
    } else if (page > pageCount) {
      page = pageCount;
    }

    const themeList: Theme[] = await this.listGenerator(
      data,
      getPageIndex(page, pageCount, pageSize)
    );

    // region buttons and row
    const prevBtn = new MessageButton()
      .setLabel("Previous")
      .setStyle(MessageButtonStyles.PRIMARY)
      .setCustomId("prev-btn");

    const nextBtn = new MessageButton()
      .setLabel("Next")
      .setStyle(MessageButtonStyles.PRIMARY)
      .setCustomId("next-btn");

    const row = new MessageActionRow()
      .addComponents(prevBtn)
      .addComponents(nextBtn);
    // endregion

    // collection

    await interaction.reply({
      content: getReply(themeList, page, pageCount),
      components: [row],
      ephemeral: true,
    });

    // region collector

    const filter = (i: MessageComponentInteraction) =>
      i.customId === button.previous || i.customId === button.next;

    if (!isNullOfUndefined(interaction.channel)) {
      return;
    }

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 180000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === button.previous) {
        await this.buttonInteraction(
          interaction,
          i,
          row,
          data,
          page,
          pageCount,
          false
        );
        // await i.deferUpdate();
        // if (page > 1) page--;
        // themeList = await this.listGenerator(data, getPageIndex(page, pageCount, page_size));
        // if (page === 1) row.components[0].setDisabled(true);
        // await interaction.editReply({content: getReply(themeList, page, pageCount), components: [row]});
      } else if (i.customId === button.next) {
        await this.buttonInteraction(
          interaction,
          i,
          row,
          data,
          page,
          pageCount,
          true
        );
        // await i.deferUpdate();
        // if (page < pageCount) page++;
        // themeList = await this.listGenerator(data, getPageIndex(page, pageCount, page_size));
        // if (page === pageCount) row.components[1].setDisabled(true);
        // await interaction.editReply({content: getReply(themeList, page, pageCount), components: [row]});
      }
    });

    // endregion
  }

  async buttonInteraction(
    interaction: CommandInteraction,
    collector: MessageComponentInteraction,
    row: MessageActionRow,
    data: Repository<Theme>,
    page: number,
    max: number,
    increase: boolean
  ) {
    await collector.deferUpdate();

    if (increase) {
      if (page < max) {
        page++;
      }
      if (page === max) {
        row.components[1].setDisabled(true);
      }
    } else {
      if (page > 1) {
        page--;
      }
      if (page === 1) {
        row.components[0].setDisabled(true);
      }
    }

    const themeList = await this.listGenerator(
      data,
      getPageIndex(page, max, pageSize)
    );
    await interaction.editReply({
      content: getReply(themeList, page, max),
      components: [row],
    });
  }

  listGenerator(data: Repository<Theme>, page: number): Promise<Theme[]> {
    return data
      .createQueryBuilder("themes")
      .where("themes.id >= :id", { id: page })
      .orderBy("id", "ASC")
      .limit(10)
      .getMany();
  }

  @ButtonComponent(button.previous)
  prevBtn() {
    return;
  }

  @ButtonComponent(button.next)
  nextBtn() {
    return;
  }
}
