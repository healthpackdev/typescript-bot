import {
  Collection,
  Message,
  MessageMentions,
  PermissionResolvable,
} from "discord.js";
import { Document } from "mongoose";
import functions from "../utils/functions";

declare global {
  type categories = "Guard" | "Moderation" | "Other";
  interface CommandOptions {
    command: {
      name: String;
      description: String;
      aliases?: String[];
      category: categories;
    };
    permissions: {
      ownerOnly?: Boolean;
      UDiscordPermission?: PermissionResolvable;
      CDiscordPermission: PermissionResolvable;
    };
    helpers: {
      dataControl?: Boolean;
      functions?: Boolean;
    };
  }
  type mentionType = "roles" | "channels" | "users" | "members";
  interface aCommand extends CommandOptions {
    execute?: execute;
  }
  interface execute {
    (message: Message, args: string[], helpers?: helpers): any;
  }
  interface IServerModalSchema extends Document {
    serverId: String;
    settings: {
      bansystem: {
        role: String;
        log: String;
        limit: String;
      };
    };
    banLimit: object;
  }
  interface helpers {
    functions?: functions;
    config?: {
      embedColor: string;
      botName: string;
      prefix: string;
    };
  }
  type hasMention = {
    (mentions: MessageMentions, mentionType: mentionType): Boolean;
  };
  type argumentControlReturns = {
    res: Boolean;
    exe?: execute;
  };
  interface functions {
    hasMention: hasMention;
  }
}
declare module "discord.js" {
  interface Client {
    commands?: Collection<String, any>;
    aliases?: Collection<String, any>;
  }
}
