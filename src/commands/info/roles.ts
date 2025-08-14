import {
  AttachmentBuilder,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { Buffer } from "node:buffer";

export const data = new SlashCommandBuilder()
  .setName("roles")
  .setDescription("Shows info about all roles on this server");
export const category = "info";

export async function execute(interaction: CommandInteraction) {
  await interaction.reply({ content: "Fetching roles info,please wait..." });
  let roles = await interaction.guild.roles.fetch();
  roles = roles.sort((r1, r2) => r2.rawPosition - r1.rawPosition);
  if (roles.size == 0) {
    return interaction.editReply({ content: "This server has no roles!" });
  } else {
    let text =
      `Name,ID,Hex color,Created at,Position,Hoisted,Mentionable,Members with this role,Permissions\n`;
    roles.forEach((v) => {
      text +=
        `${v.name},${v.id},${v.hexColor},${v.createdAt},${v.rawPosition},${v.hoist},${v.mentionable},"${
          v.members.map((m) => m.user.username).join(", ")
        }","${v.permissions.toArray().join(", ")}"\n`;
    });
    const file = new AttachmentBuilder(Buffer.from(text, "utf8")).setName(
      "roles.csv",
    );
    return interaction.editReply({
      content: "Information about all roles is in this file:",
      files: [file],
    });
  }
}
