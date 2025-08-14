import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getSecret } from "../../libraries/secrets-raw";
export const data = new SlashCommandBuilder()
  .setName("shutdown")
  .setDescription("Shuts down the bot. Only available to administrators.");

export const category = "owner";

export async function execute(interaction: CommandInteraction) {
  const ownerId = await getSecret("DISCORD_OWNERID");
  if (interaction.user.id !== ownerId) {
    return interaction.reply({
      content: "**You do not have permission to use this command.**",
      flags: 64,
    });
  }

  await interaction.reply("*Shutting down the bot...*");

  setTimeout(() => {
    console.log("Bot shutting down... Issued by:", interaction.user.username);
    process.exit(0);
  }, 1000);
}
