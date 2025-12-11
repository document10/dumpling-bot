import {
  AttachmentBuilder,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

import { Canvas } from "@napi-rs/canvas";

import { Color } from "../../libraries/color";
import { randomNumber, randomString } from "../../libraries/utils";

export const data = new SlashCommandBuilder()
  .setName("captcha")
  .setDescription("Generate a captcha image");

import { hash } from "bun";

export const category = "utility";

export async function execute(interaction: CommandInteraction) {
  const val = randomString(randomNumber(6, 12));
  const canvas = new Canvas(val.length * 40, 70);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = `#${Color.random().hex}`;
  console.log(ctx.fillStyle);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = `#${Color.random().hex}`;
  console.log(ctx.fillStyle);

  ctx.font = "60px Arial"; // use monospace font for best results
  ctx.fillText(val, 0, 60);
  for (let i = 0; i < randomNumber(10, 12); i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.strokeStyle = `#${Color.random().hex}`;
    ctx.lineWidth = randomNumber(1, 4);
    ctx.stroke();
  }

  const attachment = new AttachmentBuilder(await canvas.encode("png"), {
    name: "captcha.png",
  });
  await interaction.reply({
    content: `Solution: ||${val}||`,
    files: [attachment],
  });
}
