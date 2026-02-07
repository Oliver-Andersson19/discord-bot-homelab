import { Client, GatewayIntentBits, Events } from "discord.js";
import { pollForDeviceChanges } from "./networkWatcher.js";
import { CONFIG } from "../config/config.js";
import statusCommand from "./commands/status.js";
import pingCommand from "./commands/ping.js";


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Mappa upp kommandon
const commands = {
  status: statusCommand,
  ping: pingCommand
};

client.once(Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user.tag}`);

  // Hardcoded channel ID
  const CHANNEL_ID = "1469449791313416194";
  const channel = await client.channels.fetch(CHANNEL_ID);

  setInterval(async () => {
    await pollForDeviceChanges({

      onJoin: async (device) => {

        channel.send(`🎉 **${device.name} joined the network**`);
      },
      onLeave: async (device) => {
        
        channel.send(`👋 **${device.name} left the network**`);
      }
      
    });
  }, 1_000);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  const content = message.content.trim().toLowerCase();

  if (content.startsWith("!")) {
    const cmdName = content.slice(1);
    const cmd = commands[cmdName]; // Leta fram kommando efter namn
    if (cmd) {
      await cmd.execute(message);
    } else {
      message.reply("Unknown command.");
    }
  }
});

client.login(CONFIG.discordToken);
