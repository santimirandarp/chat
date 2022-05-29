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

export function run(app, dirname) {
    // main site
    app.get("/", /*restrict,*/ (req, res) => {
        res.sendFile(join(dirname, "client/dist/index.html"));
    });

    // security
    app.use("/access", access);

    // msgs
    app.get("/messages/:skip/:limit", /*restrict,*/ findMessages);

    // Other routes
    app.get("*", restrict, (req, res) => res.send("<p>Nothing to show...</p>"));
}

// this function returns a function
export function chat(io) {
    return async(socket) => {
      try{
        const coll = (await db).collection("messages");
        /* 'save' receives a `msg` object with `msg,tid` attributes.*/
        socket.on("save", async (msg) => {
                console.log(socket.request)
                const newMsg = { ...msg, createdAt: new Date() /*, user, ip, host*/ }
                const _id = (await saveMessage(coll, newMsg)).insertedId
                // replace tid by id for sender
                if (_id) {
                    socket.emit("saved", { _id , tid: msg.tid });
                    // the rest only need id and content (no tid)
                    socket.broadcast.emit("new", { msg:msg.msg, _id });
                }
            });
    /* 'delete' receives the _id of the message being deleted as a string */
        socket.on("delete", async (_id) => {
                const del = await deleteMessage(coll, _id);
                if (del.deletedCount===1) io.emit("deleted", _id);
        });

    /* 'update' receives the {_id,msg} object */
        socket.on("update", async ({ _id, msg:newMsg }) => {
                const suc = await updateMessage(coll, { _id, newMsg });
                if (suc) io.emit("updated", { id: _id, updateTo: newMsg });
        });

} catch (e) { socket.emit("save error", e) }

}}
