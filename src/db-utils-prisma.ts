import { PrismaClient } from "../prisma/generated/client";
import { $ } from "bun";
if (!Bun.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL environment variable is not set.");
  process.exit(1);
}

// You can add more secrets here
const recognisedEnvVars = [
  "DISCORD_CLIENTID",
  "DISCORD_TOKEN",
  "PUBLIC_KEY",
  "DISCORD_GUILDID",
  "DISCORD_OWNERID",
  "PASTEBIN_KEY",
];

try {
  switch (Bun.argv[2]) {
    case "setup":
      // Initialize table if not set up
      await $`bunx prisma db push`;
      console.log("Database schema has been pushed successfully.");
      break;
    case "update":
      console.log(`Started updating secrets...`);
      break;
    default:
      console.error(`Unknown command: ${Bun.argv[2]}`);
      process.exit(1);
  }
  console.log("All environment variables (from .env):");
  recognisedEnvVars.forEach((varName) => {
    const value = Bun.env[varName];
    if (value) {
      console.log(`${varName} found in .env`);
    } else {
      console.error(`Error: ${varName} is not set.`);
      process.exit(1);
    }
  });
  const prisma = new PrismaClient({
    datasourceUrl: Bun.env.DATABASE_URL,
  });
  recognisedEnvVars.forEach(async (varName) => {
    const value = await prisma.secret.findUnique({
      where: { name: varName },
    });
    if (value) {
      const newValue = await prisma.secret.update({
        where: { name: varName },
        data: { value: Bun.env[varName] || "" },
      });
      console.log(`Updated ${varName} in the database: ${newValue.value}`);
    } else {
      const newValue = await prisma.secret.create({
        data: {
          name: varName,
          value: Bun.env[varName] || "",
        },
      });
      console.log(
        `Created new secret ${varName} in the database: ${newValue.value}`,
      );
    }
  });
} catch (error) {
  console.error("Error connecting to the database:", error);
  process.exit(1);
}
