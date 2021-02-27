import { Message, MessageEmbed as Embed } from "discord.js";
import { CSchema } from "../utils/loadCommands";
import data from "../data/mongoose";
const execute: execute = async (
  message: Message,
  args: string[],
  { functions, config }: helpers
) => {
  switch (args[0]) {
    case "role":
      if (!functions.hasMention(message.mentions, "roles")) {
        message.channel.send("You must mention a **Role**");
      } else {
        var role = message.mentions.roles.first();
        data
          .findOneAndUpdate(
            { serverId: message.guild.id },
            { $set: { "settings.bansystem.role": role.id } }
          )
          .then(() => {
            message.channel.send(
              `Ban System Ban permission role is **${role.name}** now`
            );
          });
      }
      break;
    case "log":
      if (!functions.hasMention(message.mentions, "channels")) {
        message.channel.send("You must mention a **channel**");
      } else {
        var channel = message.mentions.channels.first();
        data
          .findOneAndUpdate(
            { serverId: message.guild.id },
            { $set: { "settings.bansystem.log": channel.id } }
          )
          .then(() => {
            message.channel.send(
              `Ban System Ban log is  **${channel.name}** now`
            );
          });
      }
      break;
    case "limit":
      if (!args[1] || isNaN(Number(args[1]))) {
        return message.reply("Write a Number");
      } else {
        data
          .findOneAndUpdate(
            { serverId: message.guild.id },
            { $set: { "settings.bansystem.limit": args[1] } }
          )
          .then(() => {
            message.channel.send(`Ban System limit is **${args[1]}** now`);
          });
      }
      break;
    default:
      const datas: any = await data.findOne({ serverId: message.guild.id });
      const embed = new Embed()
        .setAuthor(
          message.author.username,
          message.author.avatarURL({ dynamic: true })
        )
        .setDescription(`Ban System Commands`)
        .addField(
          `__**${config.prefix}ban-system role <Role>**__`,
          "Ban System ban Permission Role"
        )
        .addField(
          `__**${config.prefix}ban-system log <Channel>**__`,
          "Ban System ban log"
        )
        .addField(
          `__**${config.prefix}ban-system limit <Number>**__`,
          "Ban System daily Ban limit"
        )
        .addField(
          "Data",
          `
      **__Log__**: **${
        datas.settings.bansystem.log
          ? `<#${datas.settings.bansystem.log}>`
          : "none"
      }**
      **__Role__**: **${
        datas.settings.bansystem.role
          ? `<@&${datas.settings.bansystem.role}>`
          : "none"
      }**
      **__limit__**: **${datas.settings.bansystem.limit || "none"}**
      `
        )
        .setFooter(`Copyright © 2021 - ${config.botName} all rights reserved`)
        .setColor(config.embedColor);
      message.channel.send(embed);
      break;
  }
};
const Command = new CSchema(execute, {
  command: {
    name: "ban-system",
    description: "ban unwanted users",
    category: "Moderation",
    aliases: ["bansystem"],
  },
  permissions: {
    UDiscordPermission: "BAN_MEMBERS",
    CDiscordPermission: ["SEND_MESSAGES"],
  },
  helpers: {
    functions: true,
    dataControl: true,
  },
});
export default Command.load.bind(Command);
