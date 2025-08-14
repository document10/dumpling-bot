import { REST, Routes } from "discord.js";
import path from "node:path";
import fs from "node:fs";
import { getSecret } from "./libraries/secrets-raw";
const token = await getSecret("DISCORD_TOKEN");
const clientId = await getSecret("DISCORD_CLIENTID");
const guildId = await getSecret("DISCORD_GUILDID");
const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  // Grab all the command files from the commands directory you created earlier
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file) =>
    file.endsWith(".ts")
  );
  console.log(`Loading commands from category: ${folder}`);
  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
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

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
try {
  switch (Bun.argv[2]) {
    case "local": {
      console.log(
        `Started refreshing ${commands.length} application (/) commands.`,
      );

      // The put method is used to fully refresh all commands in the guild with the current set
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

      // The put method is used to fully refresh all commands in the guild with the current set
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
  // And of course, make sure you catch and log any errors!
  console.error(error);
}

// const commands = [];
// const commandFolders =
// import { getSecret } from "./libraries/secrets.ts";

// const token = await getSecret("DISCORD_TOKEN");
// if (!token) {
//   console.error("Error: DISCORD_TOKEN environment variable is not set.");
//   process.exit(1);
// }
// const clientId = Deno.env.get("DISCORD_CLIENTID");
// if (!clientId) {
//   console.error("Error: DISCORD_CLIENTID environment variable is not set.");
//   process.exit(1);
// }
// const guildId = Deno.env.get("DISCORD_GUILDID");
// if (!guildId) {
//   console.error("Error: DISCORD_GUILDID environment variable is not set.");
//   process.exit(1);
// }

// const commandFolders = Deno.readDir("./src/commands/");
// for await (const category of commandFolders) {
//   console.log(`Loading commands from category: ${category.name}`);
//   if (category.isDirectory) {
//     const commandFiles = Deno.readDir(`./src/commands/${category.name}`);
//     for await (const commandFile of commandFiles) {
//       if (commandFile.isFile && commandFile.name.endsWith(".ts")) {
//         const { data } = await import(
//           `./commands/${category.name}/${commandFile.name}`
//         );
//         commands.push(data.toJSON());
//         console.log(`Loaded command: ${data.name}`);
//       }
//     }
//   }
// }
// try {
//   console.log("Started refreshing application (/) commands.");
//   switch (Deno.args[0]) {
//     case "local": {
//       const data = await rest.put(
//         Routes.applicationGuildCommands(
//           clientId,
//           guildId,
//         ),
//         {
//           body: commands,
//         },
//       );

//       console.log(
//         `Successfully reloaded ${data.length} local application (/) commands.`,
//       );
//       break;
//     }
//     case "global": {
//       const data = await rest.put(
//         Routes.applicationCommands(
//           clientId,
//         ),
//         {
//           body: commands,
//         },
//       );

//       console.log(
//         `Successfully reloaded ${data.length} global application (/) commands.`,
//       );
//       break;
//     }
//     default: {
//       console.error("Invalid argument. Use 'local' or 'global'.");
//       process.exit(1);
//     }
//   }
//   console.log("Finished refreshing application (/) commands.");
// } catch (error) {
//   console.error("Error reloading application commands:");
//   console.error(error);
// }
