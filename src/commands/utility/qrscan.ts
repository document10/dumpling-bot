import { Jimp } from "jimp";
import jsQr from "jsqr";
import {
  Client,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("qrscan")
  .setDescription("Scan a QR code from an image or URL")
  .addAttachmentOption((option) =>
    option.setName("file").setDescription("QR code image")
  )
  .addStringOption((option) =>
    option.setName("url").setDescription("URL of the image")
  );

export const category = "utility";

export async function execute(interaction: CommandInteraction) {
  const file = interaction.options.getAttachment("file");
  const url = file?.url || interaction.options.getString("url");
  if (!url) {
    return interaction.reply("Please provide a file or a URL to scan.");
  }
  await interaction.deferReply();
  try {
    const image = await Jimp.read(url);
    const qrCode = jsQr(
      new Uint8ClampedArray(image.bitmap.data),
      image.bitmap.width,
      image.bitmap.height,
    );
    if (!qrCode) {
      return interaction.editReply("No QR code found in the image.");
    }
    return interaction.editReply(
      `QR code content:\n\`\`\`text\n${qrCode.data}\n\`\`\``,
    );
  } catch (error) {
    console.error(error);
    return interaction.editReply(
      "Failed to scan QR code. Please ensure the image is valid or the URL contains a QR code.",
    );
  }
}
