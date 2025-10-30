import { sql } from "bun";
import {
  CommandInteraction,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("staffrole")
  .setDescription("Sets the staff role for the server.")
  .addRoleOption((option) =>
    option.setName("role").setDescription("The staff role. Omit to remove.")
  );

export const category = "moderation";

export async function execute(interaction: CommandInteraction) {
  const role = interaction.options.getRole("role");
  if (
    !interaction.member?.permissions.has(
      PermissionsBitField.Flags.Administrator,
    ) && interaction.member?.id !== interaction.guild?.ownerId
  ) {
    return interaction.reply({
      content: "You don't have permission to use this command.",
      flags: 64,
    });
  }
  if (!role) {
    await sql`UPDATE "Server" SET "staffRole" = ${-1} WHERE "serverId" = ${interaction.guild?.id}`;
    return interaction.reply({
      content: "Removed staff role.",
    });
  }
  await sql`UPDATE "Server" SET "staffRole" = ${role.id} WHERE "serverId" = ${interaction.guild?.id}`;
  return interaction.reply({
    content: `Set staff role to <@&${role.id}>.`,
  });
}
