import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

export const category = "search";

export const data = new SlashCommandBuilder()
  .setName("word")
  .setDescription("Search for a word in the dictionary")
  .addStringOption((option) =>
    option
      .setName("word")
      .setDescription("The word to search for")
      .setRequired(true),
  );

export async function execute(interaction: CommandInteraction) {
  const word = interaction.options.getString("word", true);
  await interaction.deferReply();
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
        word,
      )}`,
    );
    if (res.ok) {
      const [json] = await res.json();
      const embeds = [];
      const embed = new EmbedBuilder()
        .setTitle(`Definitions for ${word}`)
        .setColor(Bun.env.THEME_COLOR || "#a059ff")
        .setURL(json.sourceUrls[0]);
      if (json.phonetics.length > 0) {
        var phonetics = "";
        for (const phonetic of json.phonetics) {
          phonetics += `${phonetic.text}; `;
        }
        embed.addFields({
          name: "Phonetics",
          value: phonetics,
        });
      }
      embeds.push(embed);
      for (const meaning of json.meanings) {
        const posEmbed = new EmbedBuilder()
          .setTitle(`${meaning.partOfSpeech}`)
          .setColor(Bun.env.THEME_COLOR || "#a059ff");
        var defs = "";
        for (const definition of meaning.definitions) {
          var definitions = `- ${definition.definition}\n`;
          if (definition.synonyms.length > 0) {
            definitions += `- - Synonym: ${definition.synonyms.join(", ")}\n`;
          }
          if (definition.antonyms.length > 0) {
            definitions += `- - Antonym: ${definition.antonyms.join(", ")}\n`;
          }
          if (definition.example) {
            definitions += `> Example: ${definition.example}\n`;
          }
          defs += definitions.slice(0, 1024);
        }
        posEmbed.setDescription(defs);
        embeds.push(posEmbed);
      }
      return interaction.editReply({ embeds });
    } else {
      switch (res.status) {
        case 404:
          return interaction.editReply(`No definition found for "${word}"`);
        case 500:
          return interaction.editReply(
            `An internal server error occurred while searching for "${word}"`,
          );
        default:
          return interaction.editReply(
            `Server failed to respond. For more information, please check the status code \`${res.status} ${res.statusText}\``,
          );
      }
    }
  } catch (error) {
    console.error(error);
    return interaction.editReply(
      `An error occurred while searching for "${word}"`,
    );
  }
}
