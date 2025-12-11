import {
  Client,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

import {
  author,
  author_website,
  homepage,
  keywords,
  source_host,
  version,
} from "../../../package.json" with { type: "json" };

export const data = new SlashCommandBuilder()
  .setName("about")
  .setDescription("Information about the bot");

export const category = "utility";

export async function execute(interaction: CommandInteraction) {
  const embed = new EmbedBuilder()
    .setColor(process.env?.THEME_COLOR || "#a059ff")
    .setTitle("About this bot")
    .setDescription(
      "This bot is built with [Bun](https://bun.sh/) and [Discord.js](https://discord.js.org/)",
    )
    .addFields(
      {
        name: "Author",
        value: `[${author}](${author_website})`,
        inline: true,
      },
      { name: "Version", value: version, inline: true },
      {
        name: "Source Code",
        value: `[${source_host}](${homepage})`,
        inline: true,
      },
      {
        name: "Keywords",
        value: `\`${keywords.join("` `")}\``,
        inline: true,
      },
    )
    .setTimestamp();

  return interaction.reply({ embeds: [embed] });
}
