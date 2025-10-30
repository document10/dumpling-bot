import { sql } from "bun";
import {
  AttachmentBuilder,
  Client,
  CommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("bans")
  .setDescription("Displays all bans in this server");
export const category = "moderation";
export async function execute(interaction: CommandInteraction) {
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
  await interaction.reply({ content: "Fetching bans,please wait..." });
  const bans = await interaction.guild?.bans.fetch();
  if (bans?.size == 0) {
    return interaction.editReply({
      content: "This server has no bans!",
    });
  } else {
    var text = `username,user id,reason,account created at,link to avatar\n`;
    text += bans?.map((v) =>
      `"${v.user.username}","${v.user.id}","${v.reason}","${v.user.createdAt}","${v.user.displayAvatarURL()}"\n`
    ).join("");
    var file = new AttachmentBuilder(Buffer.from(text, "utf8"))
      .setName(`bans_${interaction.guild?.id}@${Date.now()}.csv`);
    await interaction.editReply({
      content: "All the bans have been included in the following file:",
      files: [file],
    });
  }
}
