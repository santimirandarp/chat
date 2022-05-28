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

let db = connectDB(); //preconnect

export async function run(app, dirname) {
    // main site
    app.get("/", restrict, (req, res) => {
        res.sendFile(join(dirname, "client/dist/index.html"));
    });

    // security
    app.use("/access", access);

    // msgs
    app.get("/messages/:skip/:limit", restrict, findMessages);

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
                msg.createdAt = new Date();
                const s = await saveMessage(coll, msg);
                // replace tid by id for sender
                if (s) {
                    const Id = s.insertedId
                    socket.emit("saved", { _id:Id , tid: msg.tid });
                    delete msg["tid"];
                    msg._id = Id
                    // the rest do not need a tid
                    socket.broadcast.emit("new", msg);
                }
            } catch (e) {
                socket.emit("save error", e);
            }
        });

        socket.on("delete", async (_id) => {
            try {
                const coll = (await db).collection("messages");
                const del = await deleteMessage(coll, _id);
                  if (del.deletedCount===1) {
                    io.emit("deleted", _id);
                }
            } catch (e) {
                socket.emit("delete error", e);
            }
        });

        socket.on("update", async ({ _id, msg }) => {
            try {
                const coll = (await db).collection("messages");
                const suc = await updateMessage(coll, { _id, msg });
                if (suc) io.emit("updated", { id: _id, updateTo: msg });
            } catch (e) {
                socket.emit("update error", e);
            }
        });

    };
}
