import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getSecret } from "../../libraries/secrets";

export const data = new SlashCommandBuilder()
  .setName("pastebin")
  .setDescription("Create a pastebin link")
  .addStringOption((option) =>
    option.setName("text").setDescription("Text to upload").setRequired(true),
  )
  .addStringOption((option) =>
    option.setName("title").setDescription("Title for the paste"),
  )
  .addStringOption((option) =>
    option.setName("format").setDescription("Format of the paste"),
  )
  .addStringOption((option) =>
    option
      .setName("expire")
      .setDescription("The expire date of the paste (never if not specified)")
      .setChoices(
        {
          name: "Never",
          value: "N",
        },
        {
          name: "10 minutes",
          value: "10M",
        },
        {
          name: "1 hour",
          value: "1H",
        },
        {
          name: "1 day",
          value: "1D",
        },
        {
          name: "1 week",
          value: "1W",
        },
        {
          name: "2 weeks",
          value: "2W",
        },
        {
          name: "1 month",
          value: "1M",
        },
        {
          name: "6 months",
          value: "6M",
        },
        {
          name: "1 year",
          value: "1Y",
        },
      ),
  )
  .addStringOption((option) =>
    option
      .setName("publicity")
      .setDescription("Publicity of the paste (public if not specified)")
      .setChoices(
        {
          name: "Public",
          value: "0",
        },
        {
          name: "Unlisted",
          value: "1",
        },
      ),
  );

export const category = "utility";

export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply();
  const text = interaction.options.getString("text");
  const title = interaction.options.getString("title") || "Untitled";
  const format = interaction.options.getString("format") || "text";
  const expire = interaction.options.getString("expire") || "N";
  const publicity = interaction.options.getString("publicity") || "0";
  try {
    const response = await fetch("https://pastebin.com/api/api_post.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        api_dev_key: await getSecret("PASTEBIN_KEY"),
        api_option: "paste",
        api_paste_code: text,
        api_paste_name: title,
        api_paste_format: format,
        api_paste_expire_date: expire,
        api_paste_public: publicity,
      }),
    });
    if (response.ok) {
      const data = await response.text();
      await interaction.editReply(`Your pastebin link: ${data}`);
    } else {
      const data = await response.text();
      await interaction.editReply(
        `There was an error creating your pastebin link:${data}\nStatus Code: \`${response.status} ${response.statusText}\``,
      );
    }
  } catch (error) {
    console.error(error);
    await interaction.editReply(
      `There was an error creating your pastebin link:${error}`,
    );
  }
}
