// import discord.js
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import path from "node:path";
import fs from "node:fs";
import { getSecret } from "./libraries/secrets-raw";
// create a new Client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const token = await getSecret("DISCORD_TOKEN");

client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  console.log(`Loading commands from category: ${folder}`);
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file) =>
    file.endsWith(".ts")
  );
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
      console.log(`Loaded command: ${command.data.name}`);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter((file) =>
  file.endsWith(".ts")
);

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = await import(filePath);
  if (event.default) {
    if (event.default.once) {
      client.once(
        event.default.name,
        (...args) => event.default.execute(...args),
      );
    } else {
      client.on(
        event.default.name,
        (...args) => event.default.execute(...args),
      );
    }
    console.log(`Loaded event: ${event.default.name}`);
  } else {
    console.warn(
      `Event file ${filePath} does not export a default event handler.`,
    );
  }
}
// login with the token from .env.local
client.login(token);
