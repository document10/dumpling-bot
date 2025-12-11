import { CommandInteraction, SlashCommandBuilder } from "discord.js";

import { generatePassword } from "../../libraries/utils";

export const data = new SlashCommandBuilder()
  .setName("password")
  .setDescription("Generate a random password")
  .addNumberOption((option) =>
    option
      .setName("length")
      .setDescription("Length of the password")
      .setRequired(true)
      .setMinValue(8)
      .setMaxValue(100)
  )
  .addNumberOption((option) =>
    option
      .setName("complexity")
      .setDescription("Complexity of the password")
      .setRequired(false)
      .setChoices(
        { name: "Only numbers and lowercase letters", value: 0 },
        { name: "Alphanumerical characters", value: 1 },
        { name: "Alphanumerical characters and symbols", value: 2 },
      )
  );

export async function execute(interaction: CommandInteraction) {
  const length = interaction.options.getNumber("length");
  const complexity = interaction.options.getNumber("complexity");
  await interaction.reply(
    `Your password is: \`${generatePassword(length, complexity)}\``,
  );
}
