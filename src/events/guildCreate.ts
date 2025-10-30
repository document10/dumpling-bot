import { ActivityType, Client, Events, Guild } from "discord.js";
import { sql } from "bun";
export default {
  name: Events.GuildCreate,
  async execute(guild: Guild) {
    try {
      console.log(`Joined a new guild: ${guild.name} (id: ${guild.id})`);
      await sql`INSERT INTO "Server" ("name", "serverId") VALUES (${guild.name}, ${guild.id})`;
    } catch (error) {
      console.error("Error inserting server into database:", error);
    }
  },
};
