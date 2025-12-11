import {
  AttachmentBuilder,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { buffer } from "node:stream/consumers";

export const data = new SlashCommandBuilder()
  .setName("icon")
  .setDescription("Returns the icon of a website")
  .addStringOption((option) =>
    option
      .setName("website")
      .setDescription("Website address, e.g. google.com")
      .setRequired(true),
  );

export const category = "search";

export async function execute(interaction: CommandInteraction) {
  const website = interaction.options.getString("website", true);
  await interaction.deferReply();
  try {
    const res = await fetch(`https://icon.horse/icon/${website}`);
    if (res.ok) {
      const buff = await buffer(res.body);
      const img = new AttachmentBuilder(buff).setName(`icon.png`);
      return interaction.editReply({ content: "", files: [img] });
    } else {
      switch (res.status) {
        case 404:
          return interaction.editReply("Website not found");
        case 500:
          return interaction.editReply("Unknown server error");
        default:
          return interaction.editReply(
            `Server failed to respond. For more information, please check the status code \`${res.status}\``,
          );
      }
    }
  } catch (error) {
    console.error(
      `An error occured while running ${interaction.command.name}`,
      error,
    );
    return interaction.editReply(
      "Failed finding image,please try again later.",
    );
  }
}
