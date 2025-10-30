import { ActivityType, Client, Events, Guild } from "discord.js";
import { sql } from "bun";
export default {
  name: Events.GuildDelete,
  async execute(guild: Guild) {
    try {
      console.log(`Left a guild: ${guild.name} (id: ${guild.id})`);
      await sql`DELETE FROM "Server" WHERE "serverId" = ${guild.id}`;
    } catch (error) {
      console.error("Error removing server from database:", error);
    }
  },
};
