import { sql } from "bun";

export async function getSecret(name: string): Promise<string | undefined> {
  if (!Bun.env.DATABASE_URL) {
    return undefined;
  }
  if (Bun.env.DATABASE_SECRETS == "yes") {
    try {
      const conf =
        await sql`SELECT "value" FROM "Secret" WHERE "name" = ${name}`;
      if (!conf || conf.length === 0) {
        return Bun.env[name] || undefined;
      } else {
        return conf[0].value;
      }
    } catch {
      return undefined;
    }
  } else {
    return Bun.env[name] || undefined;
  }
}
