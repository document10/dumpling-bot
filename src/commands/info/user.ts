import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  User,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("user")
  .setDescription("Displays information about a user.")
  .addUserOption((option) =>
    option.setName("target").setDescription(
      "The user to get information about. If not specified, the command will use yourself.",
    )
  );

export const category = "info";

export async function execute(interaction: CommandInteraction) {
  const user: User = interaction.options.getUser("target") || interaction.user;
  const embed = new EmbedBuilder()
    .setTitle(`${user.username}'s Info`)
    .addFields(
      { name: "ID", value: user.id, inline: true },
      { name: "Username", value: user.username, inline: true },
      {
        name: "Created At",
        value: user.createdAt.toDateString(),
        inline: true,
      },
      { name: "Bot", value: user.bot ? "Yes" : "No", inline: true },
    )
    .setThumbnail(user.displayAvatarURL())
    .setColor(process.env.THEME_COLOR || "#a059ff");

  await interaction.reply({ embeds: [embed] });
}
