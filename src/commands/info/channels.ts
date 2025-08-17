import {
  AttachmentBuilder,
  Client,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("channels")
  .setDescription("Get information about all text and voice channels");

export const category = "info";

export async function execute(interaction: CommandInteraction) {
  const channels = interaction.guild.channels.cache;
  const channelTypes = {
    0: "GUILD_TEXT",
    1: "DM",
    2: "GUILD_VOICE",
    3: "GROUP_DM",
    4: "GUILD_CATEGORY",
    5: "GUILD_ANNOUNCEMENT",
    10: "ANNOUNCEMENT_THREAD",
    11: "PUBLIC_THREAD",
    12: "PRIVATE_THREAD",
    13: "GUILD_STAGE_VOICE",
    14: "GUILD_DIRECTORY",
    15: "GUILD_FORUM",
    16: "GUILD_MEDIA",
  };
  let text = "Name, ID, Type, Created at, Viewable\n";
  text += channels.map((channel) =>
    `"${channel.name}", "${channel.id}", "${
      channelTypes[Number(channel.type.toString())] || "UNKNOWN"
    }", "${channel.createdAt}", ${channel.viewable}`
  ).join("\n");
  const attachment = new AttachmentBuilder(Buffer.from(text), {
    name: `channels_${interaction.guild.id}@${Date.now()}.csv`,
  });
  await interaction.reply({ files: [attachment] });
}
