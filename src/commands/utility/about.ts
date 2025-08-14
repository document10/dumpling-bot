import {
  Client,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

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
      { name: "Author", value: "document10", inline: true },
      { name: "Version", value: "0.1.0", inline: true },
    )
    .setTimestamp();

  return interaction.reply({ embeds: [embed] });
}
