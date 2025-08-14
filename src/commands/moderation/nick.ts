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
  const member = await interaction.guild.members.fetch(user.id);
  const prevnick = member.nickname;
  const nick = interaction.options.getString("nickname", false);
  const guildbot = await interaction.guild.members.fetch(
    interaction.client.user.id,
  );
  if (!member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
    return interaction.reply({
      content: "You can't run this command.",
      ephemeral: true,
    });
  }
  if (
    guildbot.roles.highest.rawPosition <= member.roles.highest.rawPosition ||
    interaction.member.roles.highest.rawPosition <=
      member.roles.highest.rawPosition
  ) {
    return interaction.reply({
      content: "Can't perform this action because of the role herarchy.",
      ephemeral: true,
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
    await member.setNickname(nick, `run by ${interaction.user.username}`);
    return interaction.reply({ embeds: [embed] });
  } catch (error) {
    return interaction.reply(`Couldn't change nickname:\n\`${error}\``);
  }
}
