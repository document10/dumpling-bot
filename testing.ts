// This file is purely for testing, ignore it for now

// import { sql } from "bun";

// const secrets = await sql`SELECT "value" FROM "Secret"`
// secrets.sort((a, b) => a.id - b.id)
// secrets.forEach(secret => {
//   console.log(secret)
// })

import { getSecret as getSecretRaw } from "./src/libraries/secrets-raw";
import { getSecret as getSecretPrisma } from "./src/libraries/secrets-prisma";

const recognisedEnvVars = [
  "DISCORD_CLIENTID",
  "DISCORD_TOKEN",
  "PUBLIC_KEY",
  "DISCORD_GUILDID",
  "DISCORD_OWNERID",
  "PASTEBIN_KEY",
  "THEME_COLOR", // Added for theme color
];

let start = Bun.nanoseconds();
console.log(`Started fetching secrets from Raw at ${start}`);
for (const envVar of recognisedEnvVars) {
  await getSecretRaw(envVar);
  console.log(`Fetched ${envVar} from Raw (${Bun.nanoseconds()})`);
}
start = Bun.nanoseconds() - start;
console.log("Finished in ", start);

let start2 = Bun.nanoseconds();
console.log(`Started fetching secrets from Prisma at ${start2}`);
for (const envVar of recognisedEnvVars) {
  await getSecretPrisma(envVar);
  console.log(`Fetched ${envVar} from Prisma (${Bun.nanoseconds()})`);
}
start2 = Bun.nanoseconds() - start2;
console.log("Finished in ", start2);

console.log(
  `${start < start2 ? "Raw" : "Prisma"} is faster by ${
    Math.abs(start - start2)
  } nanoseconds (${(start2 / start * 100).toFixed(2)}%)`,
);
