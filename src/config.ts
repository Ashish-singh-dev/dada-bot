import dotenv from "dotenv";
dotenv.config();

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID || !GUILD_ID) {
  throw new Error("Missing environment variables");
}

const config: Record<string, string> = {
  CLIENT_ID,
  DISCORD_TOKEN,
  GUILD_ID,
};

export default config;
