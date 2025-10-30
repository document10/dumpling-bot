import {
  CachedManager,
  Client,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  type CacheFactory,
  type CacheTypeReducer,
} from "discord.js";

import { Color } from "../../libraries/color";
export const data = new SlashCommandBuilder()
  .setName("color")
  .setDescription("Get a color by name or hex code")
  .addStringOption((option) =>
    option
      .setName("input")
      .setDescription("The hex code of the color")
      .setRequired(true),
  );

export const category = "search";

export async function execute(interaction: CommandInteraction) {
  const colorInput = interaction.options.getString("input", true);
  let color = Color.fromHex(colorInput);
  if (!color) return interaction.reply("Invalid color format.");

  const embed = new EmbedBuilder()
    .setColor(`#${color.hex}`)
    .addFields(
      {
        name: "Hex",
        value: color.hex,
        inline: true,
      },
      {
        name: "RGB",
        value: `${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}`,
        inline: true,
      },
      {
        name: "CMYK",
        value: `${Math.round(color.c * 100)}, ${Math.round(color.m * 100)}, ${Math.round(color.y * 100)}, ${Math.round(color.k * 100)}`,
        inline: true,
      },
      {
        name: "HSV",
        value: `${Math.round(color.h)}, ${Math.round(color.sv * 100)}, ${Math.round(color.v * 100)}`,
        inline: true,
      },
      {
        name: "HSL",
        value: `${Math.round(color.h)}, ${Math.round(color.sl * 100)}, ${Math.round(color.l * 100)}`,
        inline: true,
      },
    )
    .setThumbnail(`https://singlecolorimage.com/get/${color.hex}/400x400`);

  return interaction.reply({ embeds: [embed] });
}
