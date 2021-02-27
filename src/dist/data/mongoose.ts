import { Schema, model } from "mongoose";

var newSchema = new Schema({
  serverId: { type: String, required: true },
  settings: {
    bansystem: {
      role: String,
      log: String,
      limit: String,
    },
  },
  banLimit: { type: Object, default: {} },
});

export default model<IServerModalSchema>("Server", newSchema, "Server-Settings");
