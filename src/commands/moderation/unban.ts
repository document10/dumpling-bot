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
  if (
    !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
  ) {
    return interaction.reply({
      content: "You can't run this command.",
      flags: 64,
    });
  }
  const bans = await interaction.guild.bans.fetch();
  const id = interaction.options.getString("id", true);
  const target = bans.find((ban) => ban.user.id == id);
  if (!target) return interaction.reply(`Cannot find user with id ${id}`);
  else {
    await interaction.guild.members.unban(
      id,
      `run by ${interaction.user.username}`,
    );
    return interaction.reply(
      `User ${target.user.username} (\`${id}\`) was unbanned succesfully.`,
    );
  }
}
