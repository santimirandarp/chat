//Node Modules
import dotenv from "dotenv";
dotenv.config();
import http from "http";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// installed modules
import { Server } from "socket.io";
import express from "express";

// local modules
import { run, chat } from './app.js';

// Environmental Variables
const { PORT, PUBLIC } = process.env;

// Servers
const app = express();
const server = http.createServer(app); //set app as httphandler
const io = new Server(server);

// trick for variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


/* --------------------------------- */

app.use(express.static(join(__dirname, PUBLIC)));
app.use(express.static(join(__dirname, PUBLIC, "favicon")));

run(app,__dirname).catch(console.dir);
io.on("connection", chat);
server.listen(PORT, () => console.log(`listening on ${PORT}`));
