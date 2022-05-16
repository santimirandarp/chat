import { connectDB } from "./connectDB.js";
import bcrypt from "bcrypt";

let db = connectDB();

export function restrict(req, res, next) {
  if (req.session && req.session.isLogged) {
    next();
  } else {
    res.redirect("/access/login");
  }
}

export async function authenticate(req, res) {
  const { username, password } = req.body;
  db = await db;
  console.log("the db is...", db);
  const users = db.collection("users");
  const user = await users.findOne({ _id: username });

  const trust = user && (await bcrypt.compare(password, user.password));

  if (trust) {
    // set session cookie
    req.session.regenerate(() => {
      req.session.isLogged = true;
      req.session.views = 1;
      res.redirect("/");
    });
  } else {
    res.json({ err: "Wrong username/password combination" });
  }
}

export async function register(req, res) {
  const { username, password } = req.body;
  db = await db;
  const users = db.collection("users");

  // Blowfish hash.
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password.trim(), salt);

  // Create user and Store hash + username in your User DB.
  try {
    const insert = await users.insertOne({ _id: username, password: hash });
    console.log(insert);
    if (insert.acknowledged) {
      // set session stuff
      req.session.isLogged = true;
      res.redirect("/");
    }
  } catch (e) {
    res.json({ err: "User already exist. Try a different one" });
  }
}
