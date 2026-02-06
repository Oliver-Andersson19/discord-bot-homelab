import dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
  discordToken: process.env.DISCORD_TOKEN,
  prometheusUrl: process.env.PROMETHEUS_URL
};
