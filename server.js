//Node Modules
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// installed modules
import express from "express";

// local modules
import security from "./own_modules/security.js";
import { restrict } from "./own_modules/middleware.js";
import messages from "./own_modules/messages.js";

// App
const app = express();
//http server
const server = http.createServer(app); //set app as httphandler
//io server
const io = new Server(server);

// trick for variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static(join(__dirname, "dist/client/public")));
app.use(express.static(join(__dirname, "dist/client/public/favicon")));

/* ========================================== */

async function run() {
    // main site
    app.get("/", restrict, (req, res) => {
        res.sendFile(join(__dirname, "client/dist/index.html"));
    });

    // security
    app.use("/security", security);

    // msgs
    app.use("/messages", messages);

    // Other routes
    app.get("*", restrict, (req, res) => res.send("<p>Nothing to show...</p>"));

}

run().catch(console.dir);



/* ------------SOCKET---------- */

io.on('connection', async (socket) => {

    socket.on('save message', async(msg) => {
        //the socket sends a message object
	    try{
		const msg = await saveMessage(msg)

                //only to the user sending the message, we now have the _id
                socket.emit('message saved', { _id: s._id, tid: s.tid });
                delete s['tid'];
                socket.broadcast.emit('new message', s);

	    } catch(e){ 
		    socket.emit('save message error', err) 
	    }
        });

    socket.on('delete message', (_id) => {
        try{
	    const del = deleteMessage(_id)
            io.emit('message deleted', 'This message was deleted');
	} catch(e){ socket.emit('delete message error', err) };
    });

    socket.on('update message', ({ _id, msg }) => {
	    try{
        const upd = await updateMessage({ _id, msg })
            socket.emit('update saved', suc);
            socket.broadcast.emit('update saved', { id: _id, updateTo: msg });
	    } catch(e){ socket.emit('update message error', err) };
    });
})


app.listen(3000, () => console.log("listening on 3000"));
