import {
  AttachmentBuilder,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

import { Canvas } from "@napi-rs/canvas";

import { Color } from "../../libraries/color";

export const data = new SlashCommandBuilder()
  .setName("color")
  .setDescription("Get a color by name or hex code")
  .addStringOption((option) =>
    option
      .setName("color")
      .setDescription("The target color (in hex, rgb, hsl, css, etc.)")
      .setRequired(true),
  );

export const category = "search";

export async function execute(interaction: CommandInteraction) {
  const colorInput = interaction.options.getString("color", true);
  const parsedColor = Bun.color(colorInput, "hex");
  let color = Color.fromHex(parsedColor || "INVALID");
  if (!color)
    return interaction.reply(
      "Color could not be parsed. Valid formats:\n- Hex: `#AABBCC` or `#abc` (capitalization doesn't matter)\n- RGB: `rgb(11, 22, 33)`\n- HSL: `hsl(5, 10%, 20%)`\n- CSS: `rebeccapurple`",
    );
  let complementary = color.inverted;

  const canvas = new Canvas(400, 200);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = `#${color.hex}`;
  ctx.font = "bold 45px Arial";
  ctx.fillRect(0, 0, 200, 200);
  ctx.fillStyle = `#${complementary.hex}`;
  ctx.fillRect(200, 0, 200, 200);
  ctx.fillText(`#${color.hex}`, 10, 50);
  ctx.fillStyle = `#${color.hex}`;
  ctx.fillText(`#${complementary.hex}`, 210, 50);

  const attachment = new AttachmentBuilder(await canvas.encode("png"), {
    name: "palette.png",
  });

  const embed = new EmbedBuilder()
    .setTitle(
      `Information about ${Bun.color([color.r, color.g, color.b], "css")}`,
    )
    .setColor(`#${color.hex}`)
    .setImage("attachment://palette.png")
    .setURL(`https://colorffy.com/color-converter?color=${color.hex}`)
    .addFields(
      {
        name: "Hex",
        value: `#${color.hex}`,
        inline: true,
      },
      {
        name: "RGB",
        value: `${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(
          color.b,
        )}`,
        inline: true,
      },
      {
        name: "CMYK",
        value: `${Math.round(color.c * 100)}%, ${Math.round(color.m * 100)}%, ${Math.round(color.y * 100)}%, ${Math.round(color.k * 100)}%`,
        inline: true,
      },
      {
        name: "HSV",
        value: `${Math.round(color.h)}, ${Math.round(color.sv * 100)}%, ${Math.round(color.v * 100)}%`,
        inline: true,
      },
      {
        name: "HSL",
        value: `${Math.round(color.h)}, ${Math.round(color.sl * 100)}%, ${Math.round(color.l * 100)}%`,
        inline: true,
      },
      {
        name: "HWB",
        value: `${Math.round(color.h)}, ${Math.round(color.w * 100)}%, ${Math.round(color.k * 100)}%`,
        inline: true,
      },
      {
        name: "Complementary",
        value: `[#${complementary.hex}](https://colorffy.com/color-converter?color=${complementary.hex})`,
        inline: true,
      },
    );
  return interaction.reply({ embeds: [embed], files: [attachment] });
}
