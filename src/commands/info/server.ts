import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("server")
  .setDescription("Displays information about the server.");

export const category = "info";

export async function execute(interaction: CommandInteraction) {
  const embed = new EmbedBuilder()
    .setTitle(`${interaction.guild.name}'s Info`)
    .addFields(
      { name: "ID", value: interaction.guild.id, inline: true },
      { name: "Owner", value: interaction.guild.ownerId, inline: true },
      {
        name: "Member Count",
        value: interaction.guild.memberCount.toString(),
        inline: true,
      },
      { name: "Created At", value: interaction.guild.createdAt.toDateString() },
    )
    .setThumbnail(interaction.guild.iconURL() || "")
    .setColor(process.env.THEME_COLOR || "#a059ff");

  await interaction.reply({ embeds: [embed] });
}
