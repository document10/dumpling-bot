import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("dm")
  .setDescription("Sends a direct message to a user.")
  .addUserOption((option) =>
    option.setName("user")
      .setDescription("The target for the message")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("content")
      .setDescription("Content of the message")
      .setRequired(true)
  );

export const category = "utility";

export async function execute(interaction: CommandInteraction) {
  const user = interaction.options.getUser("user", true);
  const content = interaction.options.getString("content", true);
  try {
    await user.send(`${content}\n\n*from ${interaction.user.tag}*`);
    return interaction.reply({
      content: "Message delivered successfully",
      flags: 64, // Ephemeral
    });
  } catch (error) {
    return interaction.reply({
      content: `Couldn't send message:\n${error}`,
      flags: 64, // Ephemeral
    });
  }
}
