import { readdir } from "fs";

class CommandSchema {
  public Command: any;
  constructor(execute: execute, options: CommandOptions) {
    this.Command = options;
    this.Command.execute = execute;
  }
  public load() {
    return this.Command;
  }
}

function loadCommands(references: any) {
  readdir("./web/dist/commands/", "utf-8", (err, files) => {
    if (err) throw new Error(err.message);

    files
      .filter((fileName: String) => fileName.endsWith(".js"))
      .forEach(async (fileName: String) => {
        const file = await import(`../commands/${fileName}`);
        const fileInfos: aCommand = file.default();
        references.commands.set(fileInfos.command.name, fileInfos);
        if (fileInfos.command.aliases) {
          fileInfos.command.aliases.forEach((alias: string) => {
            references.aliases.set(alias, fileInfos.command.name);
          });
        }
      });
  });
}

export { loadCommands as load, CommandSchema as CSchema };
