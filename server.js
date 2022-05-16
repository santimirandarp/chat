//Node Modules
import dotenv from 'dotenv';
dotenv.config();
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// installed modules
import express from "express";

// local modules
import access from "./own_modules/access.js";
import { restrict } from "./own_modules/middleware.js";
import messages from "./own_modules/messages.js";

// Environmental Variables
const {PORT,PUBLIC} = process.env

// Servers
const app = express();
const server = http.createServer(app); //set app as httphandler
const io = new Server(server);

// trick for variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static(join(__dirname, PUBLIC)));
app.use(express.static(join(__dirname, PUBLIC, "favicon")));

/* ========================================== */

async function run() {
    // main site
    app.get("/", restrict, (req, res) => {
        res.sendFile(join(__dirname, "client/dist/index.html"));
    });

    // security
    app.use("/access", access);

    // msgs
    app.use("/messages", messages);

    // Other routes
    app.get("*", restrict, (req, res) => res.send("<p>Nothing to show...</p>"));

}

run().catch(console.dir);



/* ------------SOCKET SERVER---------- */

io.on('connection', async (socket) => {

    socket.on('save message', (msg) => {
        // a socket sends a message object
		saveMessage(msg)
		    .then((s)=>{
                // replace tid by id for sender 
                socket.emit('message saved', { _id: s._id, tid: s.tid });
                delete s['tid'];
	        // the rest do not need a tid (not for sender)
                socket.broadcast.emit('new message', s);
	    })
		    .catch((e)=> socket.emit('save message error', err) )
        });

    socket.on('delete message', (_id) => {
	    deleteMessage(_id)
		    .then(() => io.emit('message deleted', 'This message was deleted'))
	            .catch(socket.emit('delete message error', err))
    });

    socket.on('update message', ({ _id, msg }) => {
        updateMessage({ _id, msg })
		    .then((suc)=>{
            socket.emit('update saved', suc);
            socket.broadcast.emit('update saved', { id: _id, updateTo: msg });
	})
			    .catch((e)=>socket.emit('update message error', e))
    })
})



server.listen(PORT, () => console.log(`listening on ${PORT}`));
