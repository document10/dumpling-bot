import { file } from "bun";
import {
  Attachment,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("sourcebin")
  .setDescription("Create a new sourcebin")
  .addAttachmentOption(
    (option) =>
      option
        .setName("code")
        .setDescription("The code to upload")
        .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("title")
      .setDescription("The title of the sourcebin")
  )
  .addStringOption((option) =>
    option
      .setName("description")
      .setDescription("The description of the sourcebin")
  );

export const category = "utility";

export async function execute(interaction: CommandInteraction) {
  const code: Attachment = interaction.options.getAttachment("code");
  const title = interaction.options.getString("title") || "Untitled";
  const description = interaction.options.getString("description") ||
    "No description";
  const linguist = require("@sourcebin/linguist");
  const extension = code.name.split(".").pop()?.toLowerCase() || "txt";
  const langCode = Object.keys(linguist.linguist).find((v) =>
    linguist.linguist[v].extension == extension
  );
  if (!langCode) {
    return interaction.reply(`Unsupported file type: \`.${extension}\``);
  }
  try {
    await interaction.deferReply();
    const content = await fetch(code.url);
    if (!content.ok) {
      return interaction.reply(`Failed to fetch code: ${content.statusText}`);
    }
    const data = {
      title: title,
      description: description,
      files: [{
        languageId: langCode,
        name: code.name,
        content: await content.text(),
      }],
    };
    const response = await fetch("https://sourceb.in/api/bins", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.error("Failed to create sourcebin:\n", response.statusText);
      return interaction.editReply("Failed to create sourcebin.");
    }
    const json = await response.json();
    return interaction.editReply(
      `Sourcebin created: https://srcb.in/${json.key}`,
    );
  } catch (error) {
    console.error(error);
    return interaction.editReply("Failed to create sourcebin.");
  }
}
