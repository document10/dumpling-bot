import {
  AttachmentBuilder,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { Readable } from "node:stream";
import { buffer } from "node:stream/consumers";

export const data = new SlashCommandBuilder()
  .setName("icon")
  .setDescription("Returns the icon of a website")
  .addStringOption((option) =>
    option.setName("website")
      .setDescription("Website address, e.g. google.com")
      .setRequired(true)
  );

export const category = "search";

export async function execute(interaction: CommandInteraction) {
  const website = interaction.options.getString("website", true);
  await interaction.deferReply();
  try {
    const res = await fetch(`https://icon.horse/icon/${website}`);
    const buff = await buffer(res.body);
    const img = new AttachmentBuilder(buff).setName(`icon.png`);
    return interaction.editReply({ content: "", files: [img] });
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
