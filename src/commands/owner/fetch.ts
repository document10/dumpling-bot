import {
  AttachmentBuilder,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { buffer } from "node:stream/consumers";
import { getSecret } from "../../libraries/secrets";

export const data = new SlashCommandBuilder()
  .setName("fetch")
  .setDescription("Fetch data from an API")
  .addStringOption((option) =>
    option.setName("url")
      .setDescription("The API endpoint URL")
      .setRequired(true)
  );

export const category = "owner";

export const execute = async (interaction: CommandInteraction) => {
  const url = interaction.options.getString("url");
  const ownerId = await getSecret("DISCORD_OWNERID");
  if (!ownerId) {
    return interaction.reply({
      content:
        "**Error: Missing required environment variable DISCORD_OWNERID.**",
      flags: 64,
    });
  }

  if (interaction.user.id !== ownerId) {
    return interaction.reply({
      content: "**You do not have permission to use this command.**",
      flags: 64,
    });
  }
  await interaction.reply(`Fetching data from ${url}...`);
  try {
    const response = await fetch(url);
    if (
      !(response.headers.get("content-type")?.includes("application") ||
        response.headers.get("content-type")?.includes("text"))
    ) {
      const buff = await buffer(response.body);
      const img = new AttachmentBuilder(buff).setName(`icon.png`);
      const embed = new EmbedBuilder()
        .setTitle("API Response")
        .setURL(url)
        .setColor(process.env.THEME_COLOR || "#a059ff")
        .addFields(
          {
            name: "Status Code",
            value: `${response.status}:${response.statusText}`,
            inline: true,
          },
          {
            name: "Redirected",
            value: `${response.redirected ? "Yes" : "No"}`,
            inline: true,
          },
        )
        .setTimestamp();
      return interaction.editReply({ embeds: [embed], files: [img] });
    } else {
      const data = await response.text();

      const embed = new EmbedBuilder()
        .setTitle("API Response")
        .setDescription(`\`\`\`${data.slice(0, 4090)}\`\`\``)
        .setURL(url)
        .setColor(process.env.THEME_COLOR || "#a059ff")
        .addFields(
          {
            name: "Status Code",
            value: `${response.status}:${response.statusText}`,
            inline: true,
          },
          {
            name: "Response Length",
            value: data.length.toString(),
            inline: true,
          },
          {
            name: "Redirected",
            value: `${response.redirected ? "Yes" : "No"}`,
            inline: true,
          },
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    }
  } catch (error) {
    console.error("Error fetching API:", error);
    await interaction.editReply("Failed to fetch API data.");
  }
};
