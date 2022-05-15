//Node Modules
import http from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// installed modules
import express from "express";

// local modules
import security from "./own_modules/security.js";
import { restrict } from "./own_modules/middleware.js";
import messages from './own_modules/messages.js';
import { updateMessage, deleteMessage, saveMessage } from './own_modules/dbcrud.js';

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
app.use(express.static(join(__dirname, "/client/public")));
app.use(express.static(join(__dirname, "/client/public/favicon")));

/* ========================================== */

async function run() {
  // main site
  app.get("/", restrict, (req, res) => {
    res.sendFile(join(__dirname, "/index.html"));
  });

  // security
  app.use("/security", security);

  // messages (crud)

  // Other routes
  app.get("*", restrict, (req, res) => res.send("<p>Nothing to show...</p>"));

  // error handlers
}

run().catch(console.dir);

app.listen(3000, () => console.log("listening on 3000"));
