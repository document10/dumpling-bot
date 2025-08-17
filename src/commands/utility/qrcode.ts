import QRCode from "qrcode";
import {
  AttachmentBuilder,
  Client,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("qrcode")
  .setDescription("Generate a QR code")
  .addStringOption((option) =>
    option.setName("text").setDescription("Text to encode").setRequired(
      true,
    )
  );

export const category = "utility";

export async function execute(interaction: CommandInteraction) {
  const text = interaction.options.getString("text");
  await interaction.deferReply();
  try {
    const qrCode = await QRCode.toBuffer(text, {
      type: "png",
      quality: 0.95,
      margin: 1,
    });
    const attachment = new AttachmentBuilder(qrCode, {
      name: "qrcode.png",
    });
    return interaction.editReply({
      content: "Here is your QR code:",
      files: [attachment],
    });
  } catch (error) {
    console.error(error);
    return interaction.editReply("Failed to generate QR code.");
  }
}
