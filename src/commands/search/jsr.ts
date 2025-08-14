import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("jsr")
  .setDescription(
    "Shows information about a package from the Javascript Registry",
  )
  .addStringOption((option) =>
    option.setName("name")
      .setDescription("name of the package")
      .setRequired(true)
  );

export const category = "search";
export async function execute(interaction: CommandInteraction) {
  const name = interaction.options.getString("name");
  await interaction.reply("Fetching package information,please wait...");
  try {
    const res = await fetch(
      `https://jsr.io/${name}/meta.json`,
      { headers: { Accept: "application/json" } },
    );
    if (res.ok) {
      const json = await res.json();
      const desc = await fetch(
        `https://jsr.io/${name}/${json?.latest}/README.md`,
        {
          headers: { "Accept": "text/markdown" },
        },
      );
      let markdown = desc.ok ? await desc.text() : "No README found.";
      const embed = new EmbedBuilder()
        .setTitle(`Information about ${name}`)
        .setURL(`https://jsr.io/${name}`)
        .setDescription(markdown.slice(0, 4096))
        .setColor(process.env.THEME_COLOR || "#a059ff")
        .addFields(
          {
            name: "Versions:",
            value: `${Object.keys(json?.versions || {}).join(", ")}`,
            inline: true,
          },
        );
      return interaction.editReply({ content: "", embeds: [embed] });
    } else {
      switch (res.status) {
        case 404:
          return interaction.editReply(`Package ${name} was not found.`);
        case 500:
          return interaction.editReply(
            `Internal server error while fetching ${name}.`,
          );
        default:
          return interaction.editReply(
            `Failed to fetch package information for ${name}.`,
          );
      }
    }
  } catch (error) {
    console.error(error);
    return interaction.editReply({
      content: `Couldn't fetch package info:\n\`${error}\``,
    });
  }
}
