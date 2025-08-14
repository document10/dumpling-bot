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
  if (
    !interaction.member.permissions.has(
      PermissionsBitField.Flags.BanMembers,
    )
  ) {
    return interaction.reply({
      content: "You can't run this command.",
      ephemeral: true,
    });
  }
  await interaction.reply({ content: "Fetching bans,please wait..." });
  const bans = await interaction.guild.bans.fetch();
  if (bans.size == 0) {
    return interaction.editReply({
      content: "This server has no bans!",
    });
  } else {
    var text = `username,user id,reason,account created at,link to avatar\n`;
    text += bans.map((v) =>
      `"${v.user.username}","${v.user.id}","${v.reason}","${v.user.createdAt}","${v.user.displayAvatarURL()}"\n`
    ).join("");
    var file = new AttachmentBuilder(Buffer.from(text, "utf8"))
      .setName(`bans_${interaction.guild.id}@${Date.now()}.csv`);
    await interaction.editReply({
      content: "All the bans have been included in the following file:",
      files: [file],
    });
  }
}
