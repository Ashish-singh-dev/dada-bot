import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { replies } from "../utils/greetingReplies";

function getReply() {
  return replies[Math.floor(Math.random() * replies.length)];
}

export const data = new SlashCommandBuilder()
  .setName("hello")
  .setDescription("Get greetings from dada");

export async function excute(interaction: CommandInteraction) {
  return interaction.reply(getReply());
}
