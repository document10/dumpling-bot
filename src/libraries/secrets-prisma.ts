import { PrismaClient } from "../../prisma/generated/client";

export async function getSecret(name: string): Promise<string> {
  if (!Bun.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  if (Bun.env.DATABASE_SECRETS == "yes") {
    const prisma = new PrismaClient({
      datasourceUrl: Bun.env.DATABASE_URL,
    });
    const conf = await prisma.secret.findUnique({ where: { name: name } });
    if (!conf) {
      console.warn(`Warning: Secret ${name} not found in the database.`);
      return Bun.env[name] || "";
    } else return conf.value;
  } else return Bun.env[name] || "";
}
