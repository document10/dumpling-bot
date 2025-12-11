import {
  AttachmentBuilder,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

import { Canvas } from "@napi-rs/canvas";

import { Color } from "../../libraries/color";

export const data = new SlashCommandBuilder()
  .setName("palette")
  .setDescription("Search for a color palette")
  .addStringOption((option) =>
    option
      .setName("query")
      .setDescription("The query to search for")
      .setRequired(true),
  );

export async function execute(interaction: CommandInteraction) {
  const query = interaction.options.getString("query", true);
  await interaction.deferReply();
  try {
    const res = await fetch(
      `https://colormagic.app/api/palette/search?q=${query}`,
    );
    if (res.ok) {
      const json = (await res.json()) as Object[];
      const embed = new EmbedBuilder()
        .setTitle(`Results for "${query}"`)
        .setColor(process.env.THEME_COLOR || "#a059ff")
        .setImage("attachment://palette.png");

      const canvas = new Canvas(100 * json.length, 600);
      const ctx = canvas.getContext("2d");
      let desc = "";
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < json.length; i++) {
        const item = json[i];
        for (let j = 0; j < item?.colors.length; j++) {
          ctx.fillStyle = item?.colors[j];
          ctx.fillRect(100 * i, 100 * j, 100, 100);
          ctx.strokeStyle = `#${
            Color.fromHex(item?.colors[j])?.inverted.hex || "ffffff"
          }`;
          ctx.lineWidth = 2;
          ctx.font = "bold 28px Arial"; //should replace with a monospace font
          ctx.strokeText(item?.colors[j].slice(1), 100 * i + 5, 100 * j + 60);
        }
        ctx.fillStyle = "#000000";
        ctx.font = "75px Arial";
        ctx.fillText((i + 1).toString(), 100 * i + 20, 580);
        desc += `\n[${
          i + 1
        }. ${item?.text}](https://colormagic.app/palette/${item?.id}): ${item?.colors.join(
          ", ",
        )}`;
      }
      embed.setDescription(desc);
      const attachment = new AttachmentBuilder(await canvas.encode("png"), {
        name: "palette.png",
      });

      return interaction.editReply({
        embeds: [embed],
        files: [attachment],
      });
    } else {
      switch (res.status) {
        case 404:
          return interaction.editReply(`No results found for "${query}"`);
        case 500:
          return interaction.editReply("Unknown server error");
        default:
          return interaction.editReply(
            `Server failed to respond. For more information, please check the status code \`${res.status} ${res.statusText}\``,
          );
      }
    }
  } catch (error) {
    console.error(error);
    return interaction.editReply(
      `An unknown internal error occurred while searching for "${query}"`,
    );
  }
}
