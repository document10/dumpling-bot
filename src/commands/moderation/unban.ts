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
  .setName("unban")
  .setDescription("Unbans a user from the server")
  .addStringOption((option) =>
    option.setName("id")
      .setDescription("ID of the user to unban")
      .setRequired(true)
  );
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
  const bans = await interaction.guild?.bans.fetch();
  const id = interaction.options.getString("id", true);
  const target = bans?.find((ban) => ban.user.id == id);
  if (!target) return interaction.reply(`Cannot find user with id ${id}`);
  else {
    await interaction.guild?.members.unban(
      id,
      `run by ${interaction.user.username}`,
    );
    return interaction.reply(
      `User ${target.user.username} (\`${id}\`) was unbanned succesfully.`,
    );
  }
}
