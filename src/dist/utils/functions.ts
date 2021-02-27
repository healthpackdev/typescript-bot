import { MessageMentions } from "discord.js";

const functions: functions = {
  hasMention: function hasMention(
    mentions: MessageMentions,
    mentionType: mentionType
  ): Boolean {
    switch (mentionType) {
      case "users":
        if (!mentions.users.first()) {
          return false;
        } else {
          return true;
        }
      case "members":
        if (!mentions.members.first()) {
          return false;
        } else {
          return true;
        }

      case "roles":
        if (!mentions.roles.first()) {
          return false;
        } else {
          return true;
        }
      case "channels":
        if (!mentions.channels.first()) {
          return false;
        } else {
          return true;
        }
      default:
        return false;
    }
    // OR you can use

    /*
    if(!mentions.[mentionType].first()) {
     return false;
    } else {
        return true;
    }
    */
  },
};

export default functions;
