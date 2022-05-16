import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

import { authenticate, register } from "./middleware.js";

dotenv.config();
const PUBLIC = process.env.PUBLIC;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

/* ==================== Login and Register ============================== */

router
  .route("/register")
  .get((req, res) =>
    res.sendFile(join(__dirname, "../", PUBLIC, "register.html"))
  )
  .post(register);

router
  .route("/login")
  .get((req, res) => res.sendFile(join(__dirname, "../", PUBLIC, "login.html")))
  .post(authenticate);

router.get("/logout", (req, res) => {
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(function () {
    res.redirect("/access/login");
  });
});

export default router;
