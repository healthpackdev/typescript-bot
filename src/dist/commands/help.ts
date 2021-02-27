import { Message, MessageEmbed as Embed } from "discord.js";
import { CSchema } from "../utils/loadCommands";

const execute: execute = (
  message: Message,
  args: String[],
  { config }: helpers
) => {
  if(args.length > 0) {

  }
  const embed = new Embed()
    .setAuthor(
      message.author.username,
      message.author.avatarURL({ dynamic: true })
    )
    .setDescription(`🤫 Select a Category\n\n {config}`)
    .addField(
      `**__Guard Commands__**`,
      `\`\`\`${message.client.commands
        .filter((command: aCommand) => command.command.category === "Guard")
        .map((command) => `${config.prefix}${command.command.name}`)
        .join(",")}\`\`\``
    )
    .addField(
      `**__Moderation Commands__**`,
      `\`\`\`${message.client.commands
        .filter(
          (command: aCommand) => command.command.category === "Moderation"
        )
        .map((command) => `${config.prefix}${command.command.name}`)
        .join(",")}
        \`\`\``
    )
    .addField(
      `**__Other Commands__**`,
      `\`\`\`${message.client.commands
        .filter((command: aCommand) => command.command.category === "Other")
        .map((command) => `${config.prefix}${command.command.name}`)
        .join(",")}
        \`\`\``
    )
    .setColor(config.embedColor)
    .setFooter(`Copyright © 2021 - ${config.botName} all rights reserved`);
  message.channel.send(embed);
};

const Command = new CSchema(execute, {
  command: {
    name: "help",
    description: "Get help about commands",
    aliases: ["commands"],
    category: "Other",
  },
  permissions: {
    ownerOnly: false,
    CDiscordPermission: ["SEND_MESSAGES"],
  },
  helpers: {
    functions: true,
  },
});

export default Command.load.bind(Command);
