import { Client, Collection } from "discord.js";
import express, { static as forReactBuild } from "express";
import mongoose from "mongoose";
import path from "path";
import config from "./dist/config.json";
import { load } from "./dist/utils/loadCommands";
import handlers from "./dist/utils/handlers";
import ApiRouter from "./dist/api-server";

const client = new Client({
  ws: {
    intents: [
      "GUILDS",
      "GUILDS",
      "GUILD_MEMBERS",
      "GUILD_MESSAGES",
      "GUILD_PRESENCES",
    ],
  },
  fetchAllMembers: true,
});
const app = express();
client.commands = new Collection();
client.aliases = new Collection();

// Starting App
app.use("/api", ApiRouter);
app.use(forReactBuild(path.join(__dirname, "client", "build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "client", "build", "index.html"))
);

load({
  commands: client.commands,
  aliases: client.aliases,
});

mongoose
  .connect(config.database.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("\x1b[32m", "Connected to database");
    client.login(config.bot.token).then(() => {
      console.log("\x1b[33m", "Discord client ready");
      app.listen(process.env.PORT || config.web.port);
      console.log("\x1b[36m", `App listening on Port ${config.web.port}`);
      console.log("\x1b[37m", "All Systems Active!");
    });
  });
const hands = new handlers(client.commands, client.aliases);

client.on("message", hands.message);
client.on("error", hands.error);
