import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("npm")
  .setDescription("Shows information about a npm package")
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
      `https://registry.npmjs.com/${encodeURIComponent(name)}`,
    );
    if (res.status === 404) {
      return interaction.editReply(`Package ${name} was not found.`);
    } else {
      const json = await res.json();
      const embed = new EmbedBuilder()
        .setTitle(`${json.name} (${json["dist-tags"].latest})`)
        .setURL(`https://www.npmjs.com/package/${encodeURI(json.name)}`)
        .setThumbnail(
          "https://static-production.npmjs.com/7a7ffabbd910fc60161bc04f2cee4160.png",
        )
        .setDescription(`${json.description}`)
        .addFields(
          {
            name: "Author",
            value: `${(json.author || { name: "Not specified" }).name}`,
          },
          {
            name: "Maintainers",
            value: `${
              (json.maintainers || [{ name: "No maintainers", email: "blank" }])
                .map((m) => `${m.name} - \`${m.email}\``).join("\n")
            }`,
          },
          {
            name: "Keywords",
            value: `${
              (json.keywords || ["none"]).map((k) => `\`${k}\``).join(" ") ||
              "none"
            }`,
          },
          {
            name: "License",
            value: `${json.license || "Not specified"}`,
          },
        )
        .setColor(process.env.THEME_COLOR || "#a059ff")
        .setFooter({
          text: `Last updated at ${json.time.modified}`,
          iconURL: interaction.client.user.displayAvatarURL(),
        })
        .setTimestamp();
      return interaction.editReply({ content: "", embeds: [embed] });
    }
  } catch (error) {
    console.log(error);
    interaction.editReply({
      content: `Couldn't fetch package info:\n\`${error}\``,
    });
  }
}
