import { CommandInteraction, Events } from "discord.js";
export default {
  name: Events.InteractionCreate,
  async execute(interaction: CommandInteraction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`,
        );
      } else {
        try {
          await command.execute(interaction);
          console.log(`Executed command: ${interaction.commandName}`);
        } catch (error) {
          console.error(
            `Error executing command ${interaction.commandName}`,
            error,
          );
        }
      }
    }
  },
};
