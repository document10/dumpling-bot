import { sql } from "bun";
import {
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";

import { parseTimeString } from "../../libraries/utils.js";

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
  const duration = interaction.options.getString("duration") || "10m";
  const [staffrole] =
    await sql`SELECT "staffRole" FROM "Server" WHERE "serverId" = ${interaction.guild?.id}`;
  if (staffrole.staffRole === "-1") {
    interaction.channel?.send({
      content:
        "WARNING: This server has no staff role set up. Only the server owner and administrators can use moderation commands. Please run `/staffrole @role` to set up a staff role.",
      flags: 64,
    });
  }
  if (
    !interaction.member?.roles.cache.has(staffrole.staffRole) &&
    !interaction.member?.permissions.has(
      PermissionsBitField.Flags.Administrator,
    ) &&
    interaction.member?.id !== interaction.guild?.ownerId
  ) {
    return interaction.reply({
      content: "You can't run this command.",
      flags: 64,
    });
  }
  if (!member.moderatable) {
    return interaction.reply({
      content: "I cannot mute this user.",
      flags: 64,
    });
  }
  if (!interaction.guild?.members.me?.permissions.has("MUTE_MEMBERS")) {
    return interaction.reply({
      content: "I do not have permission to mute members.",
      flags: 64,
    });
  }
  try {
    const dms = parseTimeString(duration) || -1;
    if (dms === -1) {
      return interaction.reply({
        content:
          "Invalid duration format. Please use formats like '10m', '1h', '2d', etc.",
        flags: 64,
      });
    }
    if (dms > 2_419_200_000) {
      return interaction.reply({
        content: "Duration exceeds the maximum limit of 28 days.",
        flags: 64,
      });
    }
    await member.timeout(dms, reason);
    const embed = new EmbedBuilder()
      .setTitle(`User Muted: ${member.user.tag}`)
      .addFields(
        { name: "Reason", value: reason, inline: true },
        { name: "Duration", value: duration, inline: true },
      )
      .setThumbnail(member.user.displayAvatarURL())
      .setTimestamp()
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL(),
      })
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
