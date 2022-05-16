import http from "http";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import dotenv from "dotenv";
dotenv.config();
import { Server } from "socket.io";
import express from "express";
import session from "express-session";

import { run, chat } from "./app.js";

const { PORT, SECRET, PUBLIC } = process.env;

const app = express();
const server = http.createServer(app); //set app as httphandler
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* -------------GLOBAL MIDDLEWARES-------------------- */

app.use(express.static(join(__dirname, PUBLIC)));
app.use(express.static(join(__dirname, PUBLIC, "favicon")));

app.use(express.urlencoded({ extended: true }));

/*
 * the id will be decrypted, and searched through the ids database
 * if the session id is there, then the
 * req.session is populated
 */
app.use(
  session({
    cookie: {
      /* domain */
      path: "/" /* and subpaths */,
      httpOnly: true /*  no access from Document.cookie */,
      /* If true, only sent encrypted over HTTPS; * If false, also on HTTP (cleartext).  */
      secure: app.get("env") === "production" ? true : false,
      sameSite: true /* only send to the webpage (domain) that **stored** it */,
    },
    resave: false /* don't save session if unmodified */,
    saveUninitialized: false /* don't create session until something stored */,
    secret: SECRET,
    /* store: MemoryStore by default. Not for production. Use MongoStore or != ones...*/
  })
);

run(app, __dirname).catch(console.dir);

io.on("connection", chat(io));

server.listen(PORT, () => console.log(`listening on ${PORT}`));
