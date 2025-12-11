import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("npm")
  .setDescription("Shows information about a npm package")
  .addStringOption((option) =>
    option
      .setName("name")
      .setDescription("name of the package")
      .setRequired(true),
  );

export const category = "search";
export async function execute(interaction: CommandInteraction) {
  const name = interaction.options.getString("name");
  await interaction.reply("Fetching package information,please wait...");
  try {
    const res = await fetch(
      `https://registry.npmjs.com/${encodeURIComponent(name)}`,
    );
    if (res.ok) {
      const json = await res.json();
      const embed = new EmbedBuilder()
        .setTitle(
          `${json?.name || "Unknown"} (${json["dist-tags"]?.latest || "no version specified"})`,
        )
        .setURL(`https://www.npmjs.com/package/${encodeURI(json.name)}`)
        .setThumbnail(
          "https://static-production.npmjs.com/7a7ffabbd910fc60161bc04f2cee4160.png",
        )
        .setDescription(json.description || "No description provided")
        .addFields(
          {
            name: "Author",
            value: `${(json.author || { name: "Not specified" }).name}`,
          },
          {
            name: "Maintainers",
            value: `${(
              json?.maintainers || [{ name: "No maintainers", email: "blank" }]
            )
              .map((m) => `${m.name} - \`${m.email}\``)
              .join("\n")
              .slice(0, 1024)}`,
          },
          {
            name: "Keywords",
            value: `${
              (json?.keywords || ["none"]).map((k) => `\`${k}\``).join(" ") ||
              "none"
            }`,
          },
          {
            name: "License",
            value: `${json?.license || "Not specified"}`,
          },
        )
        .setColor(process.env.THEME_COLOR || "#a059ff")
        .setFooter({
          text: `Last updated at ${json?.time?.modified || "not specified"}`,
          iconURL: interaction.client.user.displayAvatarURL(),
        })
        .setTimestamp();
      return interaction.editReply({ content: "", embeds: [embed] });
    } else {
      switch (res.status) {
        case 404:
          return interaction.editReply(`Package \`${name}\` not found`);
        case 500:
          return interaction.editReply("Unknown server error");
        case 503:
          return interaction.editReply(
            "Service unavailable. Please try again later.",
          );
        default:
          return interaction.editReply(
            `Server failed to respond. For more information, please check the status code \`${res.status}\``,
          );
      }
    }
  } catch (error) {
    console.log(error);
    interaction.editReply({
      content: `Couldn't fetch package info:\n\`${error}\``,
    });
  }
}
