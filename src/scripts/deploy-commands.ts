import { REST, Routes } from "discord.js";
import path from "node:path";
import fs from "node:fs";
import { getSecret } from "../libraries/secrets";
const token = await getSecret("DISCORD_TOKEN");
const clientId = await getSecret("DISCORD_CLIENTID");
const guildId = await getSecret("DISCORD_GUILDID");
const commands = [];
const foldersPath = path.join(__dirname, "../commands");
const commandFolders = fs.readdirSync(foldersPath);

if (!token || !clientId || !guildId) {
  console.error("Error: Missing required environment variables.");
  process.exit(1);
}

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file) =>
    file.endsWith(".ts")
  );
  console.log(`Loading commands from category: ${folder}`);
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      console.log(`Loaded command: ${command.data.name}`);
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}
const rest = new REST().setToken(token);
try {
  switch (Bun.argv[2]) {
    case "local": {
      console.log(
        `Started refreshing ${commands.length} application (/) commands.`,
      );
      const data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands },
      );

      console.log(
        `Successfully reloaded ${data.length} application (/) commands.`,
      );
      break;
    }
    case "global": {
      console.log(
        `Started refreshing ${commands.length} application (/) commands.`,
      );

      const data = await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
      );

      console.log(
        `Successfully reloaded ${data.length} application (/) commands.`,
      );
      break;
    }
    default: {
      console.error("Invalid argument. Use 'local' or 'global'.");
      process.exit(1);
    }
  }
} catch (error) {
  console.error(error);
}
