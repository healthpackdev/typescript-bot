import { Message, MessageEmbed as Embed } from "discord.js";
import { CSchema } from "../utils/loadCommands";
import data from "../data/mongoose";

const execute: execute = async (
  message: Message,
  args: string[],
  { functions, config }: helpers
) => {
  const timeout = 86400000;
  const datas: any = await data.findOne({ serverId: message.guild.id });
  let limit = datas.settings.bansystem.limit;
  if (!datas.settings.bansystem.role || !datas.settings.bansystem.log)
    return message.reply("please set bansystem role and log");
  if (!message.member.roles.cache.has(datas.settings.bansystem.role))
    return message.reply("You need ban permission role");
  const daily = datas.banLimit[message.author.id]
    ? datas.banLimit[message.author.id].date
    : null;
  if (
    limit &&
    // message.author.id !== message.guild.owner.id &&
    daily &&
    timeout - (Date.now() - daily) > 0
  ) {
    message.member.roles.remove(datas.settings.bansystem.role);
    await data.findOneAndUpdate(
      { serverId: message.guild.id },
      { $set: { [`banLimit.${message.author.id}`]: {} } }
    );

    return message.reply("You Reached the ban limit, i got your permission");
  } else {
    await data.findOneAndUpdate(
      { serverId: message.guild.id },
      { $set: { [`banLimit.${message.author.id}.date`]: null } }
    );
  }

  const mentioned = message.mentions.members.first();
  if (!functions.hasMention(message.mentions, "members"))
    return message.reply("Mention One Member");
  if (
    mentioned.id === message.guild.owner.id ||
    mentioned.id === message.client.user.id ||
    mentioned.id === message.author.id ||
    !mentioned.bannable
  )
    return message.reply("no Guild Owner, me or you");

  mentioned
    .fetch()
    .then((member) => {
      message.reply(member.user.username + " is banned");
      if (datas.settings.bansystem.log) {
        const x:any = message.client.channels.cache.get(datas.settings.bansystem.log);
        x.send(`${member.user.username} banned by ${message.author.username}`)
      }
    })
    .catch(() => {
      message.reply("We have an Error, please try again");
    });

  if (limit) {
    let warn = datas.banLimit[message.author.id]
      ? datas.banLimit[message.author.id].bans
      : 0;
    await data.findOneAndUpdate(
      { serverId: message.guild.id },
      { $inc: { [`banLimit.${message.author.id}.bans`]: 1 } }
    );
    if (warn >= limit) {
      await data.findOneAndUpdate(
        { serverId: message.guild.id },
        { $set: { [`banLimit.${message.author.id}.date`]: Date.now() } }
      );
      data.findOneAndUpdate(
        { serverId: message.guild.id },
        { $set: { [`banLimit.${message.author.id}.bans`]: 0 } }
      );
    }
  }
};
const Command = new CSchema(execute, {
  command: {
    name: "ban",
    description: "Ban Command",
    category: "Moderation",
  },
  permissions: {
    CDiscordPermission: ["SEND_MESSAGES", "BAN_MEMBERS", "KICK_MEMBERS"],
  },
  helpers: {
    functions: true,
    dataControl: true,
  },
});
export default Command.load.bind(Command);
