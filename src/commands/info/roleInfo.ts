import {
  CommandInteraction,
  EmbedBuilder,
  Role,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("roleinfo")
  .setDescription("Displays information about a role.")
  .addRoleOption((option) =>
    option.setName("target").setDescription(
      "The role to get information about.",
    )
      .setRequired(true)
  );

export const category = "info";

export async function execute(interaction: CommandInteraction) {
  const role = interaction.options.getRole("target") as Role;

  const embed = new EmbedBuilder()
    .setTitle(`${role.name}'s Info`)
    .setDescription(
      `Permissions:\n\`\`\`${
        role.permissions.toArray().join(", ") || "None"
      }\`\`\``,
    )
    .addFields(
      { name: "ID", value: `\`${role.id}\``, inline: true },
      {
        name: "Created At",
        value: `\`${role.createdAt.toDateString()}\``,
        inline: true,
      },
      { name: "Color", value: `\`#${role.color}\``, inline: true },
      { name: "Position", value: `${role.position.toString()}`, inline: true },
      { name: "Hoisted", value: role.hoist ? "Yes" : "No", inline: true },
      {
        name: "Mentionable",
        value: role.mentionable ? "Yes" : "No",
        inline: true,
      },
    )
    .setColor(role.color);

  await interaction.reply({ embeds: [embed] });
}
