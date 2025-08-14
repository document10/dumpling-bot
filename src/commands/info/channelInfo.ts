import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
export const data = new SlashCommandBuilder()
  .setName("channelinfo")
  .setDescription("Displays information about a channel.")
  .addChannelOption((option) =>
    option.setName("target").setDescription(
      "The channel to get information about. If not specified, the current channel will be used.",
    )
  );

export const category = "info";

export async function execute(interaction: CommandInteraction) {
  const channel = interaction.options.getChannel("target") ||
    interaction.channel;

  const embed = new EmbedBuilder()
    .setTitle(`${channel.name}'s Info`)
    .setColor(process.env.THEME_COLOR || "#a059ff")
    .addFields(
      { name: "ID", value: channel.id, inline: true },
      { name: "Type", value: channel.type.toString(), inline: true },
      { name: "Created At", value: channel.createdAt.toDateString() },
      { name: "Position", value: channel.position.toString(), inline: true },
      { name: "NSFW", value: channel.nsfw ? "Yes" : "No", inline: true },
      { name: "Topic", value: channel.topic || "No topic set" },
    );

  await interaction.reply({ embeds: [embed] });
}
