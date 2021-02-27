import { Message, Collection } from "discord.js";
import serverSchema from "../data/mongoose";
import config from "../config.json";
import functions from "../utils/functions";

class handlers {
  private commands: Collection<String, any>;
  private aliases: Collection<String, any>;
  constructor(
    commands: Collection<String, any>,
    aliases: Collection<String, any>
  ) {
    this.commands = commands;
    this.aliases = aliases;
  }
  public async message(message: Message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.bot.prefix)) return;
    var messageArguments: string[] = message.content.split(/ /g);
    var command: string = messageArguments[0].slice(1);
    var args: string[] = messageArguments.slice(1);
    var cmd: aCommand;
    if (this.commands.has(command)) {
      cmd = this.commands.get(command);
    } else if (this.aliases.has(command)) {
      cmd = this.commands.get(this.aliases.get(command));
    } else {
      return message.channel.send(`I don't have  **${command}** Command`);
    }

    var helpers: helpers = {
      config: {
        embedColor: config.bot["embed-color"],
        botName: config.bot.name,
        prefix: config.bot.prefix,
      },
    };
    if (!message.member.hasPermission(cmd.permissions.UDiscordPermission)) {
      return message.channel.send(
        `You need **${cmd.permissions.UDiscordPermission.toString().toLowerCase()}** Permission`
      );
    }
    if (cmd.helpers.dataControl === true) {
      const datas:any = await serverSchema.findOne({ serverId: message.guild.id });
      if (!datas) {
        const newData = new serverSchema({
          serverId: message.guild.id
        });
        await newData.save();
      }
    }
    if (cmd.helpers.functions === true) {
      helpers.functions = functions;
    }
    cmd.execute(message, args, helpers);
  }

  public error(error: Error) {
    return console.error(`${error.name}:` + error.message);
  }
}

export default handlers;
