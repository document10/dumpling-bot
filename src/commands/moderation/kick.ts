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
  const guildbot = await interaction.guild.members.fetch(
    interaction.client.user.id,
  );
  if (!interaction.member.permissions.has("KICK_MEMBERS")) {
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
  if (member.user.id == interaction.guild.ownerId) {
    return interaction.reply({
      content: "Can't perform this action on the server owner.",
      flags: 64,
    });
  }
  if (
    guildbot.roles.highest.rawPosition <=
      member.roles.highest.rawPosition ||
    interaction.member.roles.highest.rawPosition <=
      member.roles.highest.rawPosition
  ) {
    return interaction.reply({
      content: "Can't perform this action because of the role hierarchy.",
      flags: 64,
    });
  }
  var serverEmbed = new EmbedBuilder()
    .setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.displayAvatarURL({
        size: 512,
        dynamic: true,
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
    .setTitle(`You have been kicked from ${interaction.guild.name}`)
    .setDescription(`Reason: ${reason}`)
    .setColor("#ff0000")
    .setTimestamp()
    .setFooter({
      text: `You may rejoin the server if you have the invite link.`,
      iconURL: interaction.guild.iconURL({ size: 512, dynamic: true }),
    });
  try {
    await member.send({ embeds: [dmEmbed] });
    await member.kick(`${reason},run by ${interaction.user.username}`);
    return interaction.reply({ embeds: [serverEmbed] });
  } catch (error) {
    return interaction.reply(`Action failed:\n\`${error}\``);
  }
}
