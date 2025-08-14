import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("wikipedia")
  .setDescription("Search Wikipedia for a given query")
  .addStringOption((option) =>
    option.setName("query")
      .setDescription("The search query")
      .setRequired(true)
  );

export const category = "search";

export async function execute(interaction: CommandInteraction) {
  const query = interaction.options.getString("query");
  await interaction.reply("Searching Wikipedia, please wait...");
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${
        encodeURIComponent(query)
      }`,
    );
    if (res.ok) {
      const json = await res.json();
      const embed = new EmbedBuilder()
        .setTitle(json.title)
        .setURL(json.content_urls.desktop.page)
        .setDescription(json.extract)
        .setThumbnail(
          json.thumbnail?.source ||
            "https://en.wikipedia.org/static/images/icons/wikipedia.png",
        )
        .setColor(process.env.THEME_COLOR || "#a059ff")
        .setFooter({
          text:
            `Revision ${json?.revision}, Last updated at ${json?.timestamp}`,
          iconURL: interaction.client.user.displayAvatarURL(),
        });
      return interaction.editReply({ embeds: [embed] });
    } else {
      switch (res.status) {
        case 404:
          return interaction.editReply({
            content: `No results found for \`${query}\``,
          });
        case 500:
          return interaction.editReply({
            content:
              `Wikipedia is currently unavailable, please try again later.`,
          });
        default:
          return interaction.editReply({
            content: `An unexpected error occurred: ${res.statusText}`,
          });
      }
    }
  } catch (error) {
    console.error(error);
    return interaction.editReply({
      content: `Couldn't search Wikipedia:\n\`${error}\``,
    });
  }
}
