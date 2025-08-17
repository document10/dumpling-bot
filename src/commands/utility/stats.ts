import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import os from "node:os";
export const data = new SlashCommandBuilder()
  .setName("stats")
  .setDescription("Replies with statistics about the bot");

export const category = "utility";
export async function execute(interaction: CommandInteraction) {
  const diff = new Date(Date.now() - interaction.client.readyTimestamp);
  diff.setDate(diff.getDate() - 4);
  const embed = new EmbedBuilder()
    .setTitle(`Information about ${interaction.client.user.username}`)
    .setColor(process.env.THEME_COLOR || "#a059ff")
    .setThumbnail(interaction.client.user.displayAvatarURL())
    .setTimestamp()
    .addFields(
      {
        name: "Bot stats",
        value:
          `Uptime: \`${diff.getUTCDay()}d ${diff.getUTCHours()}h ${diff.getUTCMinutes()}m ${diff.getUTCSeconds()}s\`\nUp since: \`${interaction.client.readyAt.toISOString()}\`\nLatency: ${interaction.client.ws.ping} ms`,
      },
      {
        name: "Bot activity",
        value:
          `Servers: ${interaction.client.guilds.cache.size}\nChannels: ${interaction.client.channels.cache.size}\nUsers: ${interaction.client.users.cache.size}\nEmojis: ${interaction.client.emojis.cache.size}\nCommands: ${interaction.client.commands.size}`,
      },
      {
        name: "Hosting information",
        value:
          `Platform: ${globalThis.process.platform} ${os.release()} ${globalThis.process.arch}\nBun version: ${Bun.version}\nCPUs: ${os.cpus().length}\nMemory : ${
            Math.round(os.freemem() / 1024 / 1024 / 1024)
          } /${Math.round(os.totalmem() / 1024 / 1024 / 1024)} GB (${
            Math.round((os.freemem() / os.totalmem()) * 100)
          }%)`,
      },
    );
  return interaction.reply({ embeds: [embed] });
}
