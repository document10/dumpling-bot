// import { PrismaClient } from "../../prisma/generated/client";

import { sql } from "bun";

export async function getSecret(name: string): Promise<string> {
  if (!Bun.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  if (Bun.env.DATABASE_SECRETS == "yes") {
    const conf = await sql`SELECT "value" FROM "Secret" WHERE "name" = ${name}`;
    if (!conf) {
      console.warn(`Warning: Secret ${name} not found in the database.`);
      return Bun.env[name] || "";
    } else return conf[0].value;
  } else return Bun.env[name] || "";
}
