import {
  Client,
  CommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("staffdm")
  .setDescription(
    "Sends a direct message to a user on behalf of the staff team.",
  )
  .addUserOption((option) =>
    option.setName("user")
      .setDescription("The target for the message")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("content")
      .setDescription("Content of the message")
      .setRequired(true)
  );
export const category = "moderation";
export async function execute(interaction: CommandInteraction) {
  if (
    !interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)
  ) {
    return interaction.reply({
      content: "You can't run this command.",
      flags: 64,
    });
  }
  const user = interaction.options.getUser("user", true);
  const content = interaction.options.getString("content", true);
  const embed = new EmbedBuilder()
    .setTitle(`Message from ${interaction.guild.name} staff team`)
    .setThumbnail(interaction.guild.iconURL())
    .setDescription(content)
    .setFooter({
      text: `You received this message as a notice from the server staff team.`,
      iconURL: interaction.client.user.displayAvatarURL(),
    })
    .setColor("#0000ff")
    .setTimestamp();
  try {
    await user.send({ embeds: [embed] });
    return interaction.reply({
      content: "Message delivered succesfully",
      flags: 64,
    });
  } catch (error) {
    return interaction.reply({
      content: `Couldn't send message:\n${error}`,
      flags: 64,
    });
  }
}
