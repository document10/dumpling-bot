import {
  Client,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

import color from "color";
export const data = new SlashCommandBuilder()
  .setName("color")
  .setDescription("Get a color by name or hex code")
  .addStringOption((option) =>
    option.setName("input").setDescription("The color in hex or rgb format")
      .setRequired(true)
  );

export const category = "search";

export async function execute(interaction: CommandInteraction) {
  const colorInput = interaction.options.getString("input", true);
  let parsedColor;
  try {
    parsedColor = color(colorInput);
  } catch (error) {
    return interaction.reply("Invalid color format.");
  }
  const embed = new EmbedBuilder()
    .setColor(parsedColor.hex())
    .setTitle(`Information about ${parsedColor.keyword()}`)
    .addFields(
      { name: "Hex", value: parsedColor.hex(), inline: true },
      {
        name: "RGB",
        value: `${Math.round(parsedColor.red())}, ${
          Math.round(parsedColor.green())
        }, ${Math.round(parsedColor.blue())}`,
        inline: true,
      },
      {
        name: "HSV",
        value: `${Math.round(parsedColor.hue())}, ${
          Math.round(parsedColor.saturationv())
        }, ${Math.round(parsedColor.value())}`,
        inline: true,
      },
      {
        name: "HSVL",
        value: `${Math.round(parsedColor.hue())}, ${
          Math.round(parsedColor.saturationl())
        }, ${Math.round(parsedColor.lightness())}`,
        inline: true,
      },
      {
        name: "CMYK",
        value: `${Math.round(parsedColor.cyan())}, ${
          Math.round(parsedColor.magenta())
        }, ${Math.round(parsedColor.yellow())}, ${
          Math.round(parsedColor.black())
        }`,
        inline: true,
      },
    )
    .setThumbnail(
      `https://singlecolorimage.com/get/${parsedColor.hex().slice(1)}/400x400`,
    )
    .setTimestamp();

  return interaction.reply({ embeds: [embed] });
}
