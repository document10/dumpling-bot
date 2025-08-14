import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

export async function execute(interaction: CommandInteraction) {
  await interaction.reply(
    `:ping_pong: **Pong!**\n:satellite: Latency is ${
      Date.now() - interaction.createdTimestamp
    } ms.\n:signal_strength: WebSocket ping is ${interaction.client.ws.ping} ms.`,
  );
}
