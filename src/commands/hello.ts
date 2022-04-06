import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

const random_replies = [
  "Hello Motherfukcer",
  "Hey it's dada here",
  "LOL",
  "Shutup mc don't mess with dada",
];

function getReply() {
  return random_replies[Math.floor(Math.random() * random_replies.length)];
}

export const data = new SlashCommandBuilder()
  .setName("hello")
  .setDescription("Get greetings from dada");

export async function excute(interaction: CommandInteraction) {
  return interaction.reply(getReply());
}
