import {
  Client,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

import {
  author,
  homepage,
  keywords,
  version,
} from "../../../package.json" with {
  type: "json",
};

export const data = new SlashCommandBuilder()
  .setName("about")
  .setDescription("Information about the bot");

export const category = "utility";

export async function execute(interaction: CommandInteraction) {
  const embed = new EmbedBuilder()
    .setColor(process.env.THEME_COLOR || "#a059ff")
    .setTitle("About this bot")
    .setDescription("This bot is built with Bun and Discord.js")
    .addFields(
      {
        name: "Author",
        value: `[${author}](https://document10.github.io/)`,
        inline: true,
      },
      { name: "Version", value: version, inline: true },
      {
        name: "Source Code",
        value: `[GitHub](${homepage})`,
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
