import { sql } from "bun";
import {
  Client,
  CommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
export const data = new SlashCommandBuilder()
  .setName("kick")
  .setDescription("Kicks a member from the server.")
  .addUserOption((option) =>
    option.setName("target").setDescription("The member to kick")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("reason").setDescription("The reason for kick")
  );

export const category = "moderation";

export async function execute(interaction: CommandInteraction) {
  const member = interaction.options.getMember("target");
  const reason = interaction.options.getString("reason") || "None specified";
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
  if (member.user.id == interaction.client.user.id) {
    return interaction.reply({
      content: "Can't run this command on myself.",
      flags: 64,
    });
  }
  if (member.user.id == interaction.guild?.ownerId) {
    return interaction.reply({
      content: "Can't perform this action on the server owner.",
      flags: 64,
    });
  }
  var serverEmbed = new EmbedBuilder()
    .setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.displayAvatarURL({
        size: 512,
      }),
    })
    .setTitle(`${member.user.username} succesfully kicked `)
    .addFields(
      {
        name: "Reason",
        value: reason,
      },
    )
    .setColor("#0000ff")
    .setThumbnail(member.displayAvatarURL({ size: 512, dynamic: true }))
    .setTimestamp();
  const dmEmbed = new EmbedBuilder()
    .setTitle(`You have been kicked from ${interaction.guild?.name}`)
    .setDescription(`Reason: ${reason}`)
    .setColor("#ff0000")
    .setTimestamp()
    .setFooter({
      text: `You may rejoin the server if you have the invite link.`,
      iconURL: interaction.guild?.iconURL({ size: 512 }) ||
        interaction.client.user.displayAvatarURL({ size: 512 }),
    });
  try {
    await member.send({ embeds: [dmEmbed] });
  } catch (error) {
    interaction.channel?.send({
      content:
        "INFO: I was unable to send a DM to the member. They might have DMs disabled.",
      flags: 64,
    });
  }
  try {
    await member.kick(`${reason},run by ${interaction.user.username}`);
    return interaction.reply({ embeds: [serverEmbed] });
  } catch (error) {
    return interaction.reply(`Action failed:\n\`${error}\``);
  }
}
