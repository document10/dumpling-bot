// import { PrismaClient } from "../prisma/generated/client";
import { sql } from "bun";
import { getSecret } from "./libraries/secrets-raw";
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
      await sql`CREATE TABLE IF NOT EXISTS "Secret" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL UNIQUE,
        "value" TEXT NOT NULL
      )`;
      console.log("Database schema has been set up successfully.");
      break;
    case "update":
      console.log(`Started updating secrets...`);
      break;
    case "export":
      console.log(`Started exporting secrets...`);
      Bun.write("old.env", (await Promise.all(recognisedEnvVars.map(async varName => `${varName}=${await getSecret(varName)}`))).join("\n"));
      process.exit(0);
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
  recognisedEnvVars.forEach(async (varName) => {
    const value = await sql`SELECT * FROM "Secret" WHERE "name" = ${varName}`;
    if (value.length > 0) {
      await sql`UPDATE "Secret" SET "value" = ${
        Bun.env[varName] || ""
      } WHERE "name" = ${varName}`;
      const newValue =
        await sql`SELECT * FROM "Secret" WHERE "name" = ${varName}`;
      console.log(`Updated ${varName} in the database: ${newValue[0].value}`);
    } else {
      const newValue =
        await sql`INSERT INTO "Secret" ("name", "value") VALUES (${varName}, ${
          Bun.env[varName] || ""
        }) RETURNING *`;
      console.log(
        `Created new secret ${varName} in the database: ${newValue[0].value}`,
      );
    }
  });
} catch (error) {
  console.error("Error initializing database:", error);
  process.exit(1);
}

// try {
//   const prisma = new PrismaClient({
//     datasourceUrl: Bun.env.DATABASE_URL,
//   });
//   recognisedEnvVars.forEach(async (varName) => {
//     const value = await prisma.secret.findUnique({
//       where: { name: varName },
//     });
//     if (value) {
//       const newValue = await prisma.secret.update({
//         where: { name: varName },
//         data: { value: Bun.env[varName] || "" },
//       });
//       console.log(`Updated ${varName} in the database: ${newValue.value}`);
//     } else {
//       const newValue = await prisma.secret.create({
//         data: {
//           name: varName,
//           value: Bun.env[varName] || "",
//         },
//       });
//       console.log(
//         `Created new secret ${varName} in the database: ${newValue.value}`,
//       );
//     }
//   });
// } catch (error) {
//   console.error("Error connecting to the database:", error);
//   process.exit(1);
// }
