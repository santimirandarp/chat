import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import security from "./own_modules/security.js";
import { restrict } from "./own_modules/middleware.js";

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
