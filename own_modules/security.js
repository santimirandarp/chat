import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

import { authenticate, register } from "./middleware.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

/* ================================================== */

router.use(express.urlencoded({ extended: true }));

router.use(
  session({
    cookie: {
      /* maxAge */
      /* expires */
      /* domain */
      path: "/" /* and subpaths */,
      httpOnly: true /*  no access from Document.cookie */,
      secure:
        router.get("env") === "production"
          ? true
          : false /* Needs cert (TLS). If true, only sent encrypted over  HTTPS; If false, also on HTTP (cleartext). */,
      sameSite: true /* only send to the webpage (domain) that **stored** it */,
    },
    resave: false /* don't save session if unmodified */,
    saveUninitialized: false /* don't create session until something stored */,
    secret: process.env.SECRET,
    /* genid: function that generates a unique ID, i.e avoids clashes. By default uid-safe is used. */
    /* name: for the session cookie */
    /* store: MemoryStore by default. Not for production. Use MongoStore or != ones...*/
  })
);

router
  .route("/register")
  .get((req, res) => res.sendFile(join(__dirname, "../client/public/register.html")))
  .post(register);

router
  .route("/login")
  .get((req, res) => res.sendFile(join(__dirname, "../client/public/login.html")))
  .post(authenticate);

router.get("/logout", (req, res) => {
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(function () {
    res.redirect("/");
  });
});

export default router;
