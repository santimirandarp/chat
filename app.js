import { join } from "path";

import { connectDB } from "./connectDB.js";
import access from "./own_modules/access.js";
import { restrict } from "./own_modules/middleware.js";
import {
  deleteMessage,
  updateMessage,
  saveMessage,
  findMessages,
} from "./own_modules/dbcrud.js";

let db = connectDB();//preconnect

export async function run(app, dirname) {
  // main site
  app.get("/", restrict, (req, res) => {
    res.sendFile(join(dirname, "client/dist/index.html"));
  });

  // security
  app.use("/access", access);

  // msgs
  app.get("/messages/:skip/:limit", findMessages);

  // Other routes
  app.get("*", restrict, (req, res) => res.send("<p>Nothing to show...</p>"));
}

export function async chat(io) {
  const coll = (await db).collection("messages");
  return (socket) => {
    socket.on("save message", async (msg) => {
      
      // a socket sends a message object
      try {
        const s = await saveMessage(coll, msg);
        // replace tid by id for sender
        socket.emit("message saved", { _id: s._id, tid: s.tid });
        delete s["tid"];
        // the rest do not need a tid (not for sender)
        socket.broadcast.emit("new message", s);
      } catch (e) {
        socket.emit("save message error", e);
      }
    });

    socket.on("delete message", async (_id) => {
      try {
        const del = await deleteMessage(coll, _id);
        if (del) io.emit("message deleted", "This message was deleted");
      } catch (e) {
        socket.emit("delete message error", e);
      }
    });

    socket.on("update message", async ({ _id, msg }) => {
      try {
        const suc = await updateMessage(coll, { _id, msg });
        socket.emit("update saved", suc);
        socket.broadcast.emit("update saved", { id: _id, updateTo: msg });
      } catch (e) {
        socket.emit("update message error", e);
      }
    });
  };
}
