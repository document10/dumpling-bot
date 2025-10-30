import { sql } from "bun";
import { getSecret } from "../libraries/secrets";
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

if (Bun.argv.length < 3) {
  console.error(
    "Usage: bun run src/scripts/db-utils.ts <setup|update|export|purge|help>",
  );
  process.exit(1);
}

try {
  switch (Bun.argv[2]) {
    case "setup":
      console.log("Setting up database schema...");
      await sql`CREATE TABLE IF NOT EXISTS "Secret" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL UNIQUE,
        "value" TEXT NOT NULL
      )`;

      await sql`CREATE TABLE IF NOT EXISTS "Server" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "serverId" TEXT NOT NULL UNIQUE,
        "staffRole" TEXT NOT NULL DEFAULT '-1',
        "welcomeChannel" TEXT NOT NULL DEFAULT '-1',
        "leaveChannel" TEXT NOT NULL DEFAULT '-1'
      )`;

      console.log("Database schema has been set up successfully.");
      break;
    case "update":
      console.log(`Started updating secrets...`);
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
        const value =
          await sql`SELECT * FROM "Secret" WHERE "name" = ${varName}`;
        if (value.length > 0) {
          await sql`UPDATE "Secret" SET "value" = ${
            Bun.env[varName] || ""
          } WHERE "name" = ${varName}`;
          const newValue =
            await sql`SELECT * FROM "Secret" WHERE "name" = ${varName}`;
          console.log(
            `Updated ${varName} in the database: ${newValue[0].value}`,
          );
        } else {
          const newValue =
            await sql`INSERT INTO "Secret" ("name", "value") VALUES (${varName}, ${
              Bun.env[varName] || ""
            }) RETURNING *`;
          console.log(
            `Created new secret ${varName} in the database: ${
              newValue[0].value
            }`,
          );
        }
      });
      break;
    case "export":
      Bun.write(
        "backups/old.env",
        (await Promise.all(
          recognisedEnvVars.map(async (varName) =>
            `${varName}=${await getSecret(varName)}`
          ),
        )).join("\n"),
      );
      console.log("Exported secrets to backups/old.env");
      const serverInfo = await sql`SELECT * FROM "Server"`;
      Bun.write("backups/servers.json", JSON.stringify(serverInfo, null, 2));
      console.log("Exported server information to backups/servers.json");
      break;
    case "purge":
      console.log("Purging database tables...");
      await sql`DROP TABLE IF EXISTS "Secret"`;
      await sql`DROP TABLE IF EXISTS "Server"`;
      console.log("Database tables have been purged.");
      break;
    case "help":
      console.log(
        "Usage: bun run src/scripts/db-utils.ts <setup|update|export|purge>\n",
      );
      console.log("Commands:");
      console.log("  setup   - Set up the database schema.");
      console.log(
        "  update  - Update secrets in the database from environment variables.",
      );
      console.log("  export  - Export secrets and server info to backups.");
      console.log("  purge   - Drop all tables from the database.");
      console.log("  help    - Show this help message.");
      break;
    default:
      console.error(`Unknown command: ${Bun.argv[2]}`);
      console.error(
        "Usage: bun run src/scripts/db-utils.ts <setup|update|export|purge|help>",
      );
      process.exit(1);
  }
} catch (error) {
  console.error("Error initializing database:", error);
  process.exit(1);
}
