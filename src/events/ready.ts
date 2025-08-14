import { ActivityType, Client, Events } from "discord.js";

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: Client<true>) {
    client.user.setPresence(
      {
        activities: [{
          name: `${client.commands.size} commands`,
          type: ActivityType.Listening,
        }],
      },
    );
    console.log(`Logged in as ${client.user.username} (${client.user.id}) !`);
  },
};
