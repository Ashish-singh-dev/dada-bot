import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with pong!");

export async function excute(interaction: CommandInteraction) {
  return interaction.reply("Pong!");
}
