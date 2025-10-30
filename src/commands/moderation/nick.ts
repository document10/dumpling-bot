import { sql } from "bun";
import {
  Client,
  CommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("nick")
  .setDescription("Change a user's nickname")
  .addUserOption((option) =>
    option.setName("user")
      .setDescription("The target user (leave blank for yourself)")
  )
  .addStringOption((option) =>
    option.setName("nickname")
      .setDescription("New nickname (leave blank to clear)")
  );
export const category = "moderation";
export async function execute(interaction: CommandInteraction) {
  const user = interaction.options.getUser("user", false) ||
    interaction.member;
  const member = await interaction.guild?.members.fetch(user.id);
  const prevnick = member?.nickname;
  const nick = interaction.options.getString("nickname", false);
  const guildbot = await interaction.guild?.members.fetch(
    interaction.client.user.id,
  );
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
  const embed = new EmbedBuilder()
    .setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setTitle("Nickname changed succesfully")
    .setColor(member.displayHexColor)
    .setTimestamp()
    .setThumbnail(member.displayAvatarURL())
    .addFields(
      {
        name: "Previous nickname",
        value: `${prevnick}`,
        inline: true,
      },
      {
        name: "New nickname",
        value: `${nick}`,
        inline: true,
      },
    );
  try {
    await member?.setNickname(nick, `run by ${interaction.user.username}`);
    return interaction.reply({ embeds: [embed] });
  } catch (error) {
    return interaction.reply(`Couldn't change nickname:\n\`${error}\``);
  }
}
