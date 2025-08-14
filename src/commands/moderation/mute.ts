import {
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";

import ms from "ms";

export const data = new SlashCommandBuilder()
  .setName("mute")
  .setDescription("Mute a user")
  .addUserOption((option) =>
    option.setName("target").setDescription("The user to mute").setRequired(
      true,
    )
  )
  .addStringOption((option) =>
    option.setName("reason").setDescription("The reason for muting")
  )
  .addStringOption((option) =>
    option.setName("duration").setDescription(
      "The duration of the mute in minutes",
    )
  );

export const category = "moderation";

export async function execute(interaction: CommandInteraction) {
  const member: GuildMember = interaction.options.getMember("target");
  const reason = interaction.options.getString("reason") ||
    "No reason provided";
  const duration = interaction.options.getString("duration") || "10m"; // Default to 10 minutes if no duration is provided
  //check member permissions
  if (!member.moderatable) {
    return interaction.reply({
      content: "I cannot mute this user.",
      flags: 64,
    });
  }
  // check if the user is allowed to mute
  if (!interaction.member.permissions.has("MUTE_MEMBERS")) {
    return interaction.reply({
      content: "You do not have permission to mute members.",
      flags: 64,
    });
  }
  //check if the bot has permission to mute
  if (!interaction.guild.members.me.permissions.has("MUTE_MEMBERS")) {
    return interaction.reply({
      content: "I do not have permission to mute members.",
      flags: 64,
    });
  }
  try {
    const dms = ms(duration);
    // Mute the user for the specified duration
    await member.timeout(dms, reason);
    const embed = new EmbedBuilder()
      .setTitle("User Muted")
      .addFields(
        { name: "User", value: member.toString() },
        { name: "Reason", value: reason },
      )
      .setColor("#ff0000");

    return interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error("Error muting user:", error);
    return interaction.reply({
      content: "An error occurred while muting the user.",
      flags: 64,
    });
  }
}
