import { join } from "path";

import access from "./own_modules/access.js";
import { connectDB } from "./own_modules/connectDB.js";
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

// this function returns a function
export function chat(io) {

  return (socket) => {

    socket.on("save", async (msg) => {
      // a socket sends a message object
      try {
        const coll = (await db).collection("messages");
        const s = await saveMessage(coll, msg);
        // replace tid by id for sender
        if(s) {
                socket.emit("saved", { _id: s._id, tid: s.tid });
                delete s["tid"];
                // the rest do not need a tid (not for sender)
                socket.broadcast.emit("new", s);
        }
      } catch (e) {
        socket.emit("save error", e);
      }
    });

    socket.on("delete", async (_id) => {
      try {
        const coll = (await db).collection("messages");
        const del = await deleteMessage(coll, _id);
        if(del){ io.emit("deleted", _id); }
      } catch (e) {
        socket.emit("delete error", e);
      }
    });

    socket.on("update", async ({ _id, msg }) => {
      try {
        const coll = (await db).collection("messages");
        const suc = await updateMessage(coll, { _id, msg });
        io.emit("updated", { id: _id, updateTo: msg });
      } catch (e) {
        socket.emit("update message error", e);
      }
    });
  };

}
