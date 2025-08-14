import { Events } from "discord.js";
export default {
  name: Events.Error,
  execute(error: Error) {
    console.error("Unhandled error occured! More info:\n", error);
  },
};
