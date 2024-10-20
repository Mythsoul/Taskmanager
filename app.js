import express from "express";
import dotenv from "dotenv";
import pg from "pg";
import path from "path";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { database } from "./src/config/db.js";
import { fileURLToPath } from "url";
import session from "express-session";
import { add_task, update_task_status, render_task } from "./src/models/Task.js";
import {
  renderlogin,
  renderregister,
  google_auth,
  google_callback,
  renderlogout,
} from "./src/routes/authRoutes.js";
import connectPgSimple from "connect-pg-simple";
const app = express();
const port = 3000;

dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PgSession = connectPgSimple(session);
 try{ app.use(
  session({
      store: new PgSession({
          pool: database, 
          tableName: "sessions",  
      }),
      secret: process.env.SESSION_SECRET || "keyboard cat",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  })
);
console.log("sucessfully added sesssion")
}catch(err){console.log(err);}



app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", renderlogin);

app.get("/register", renderregister);

app.get("/auth/google", google_auth);

app.get(
  "/auth/google/dashboard",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/dashboard",
  })
);

app.get("/dashboard", checkAuthenticated, async (req, res) => {
  const user = req.user;
console.log(req.user);
  try {
    
    const tasks = await render_task(user.id);
    res.render("dashboard", {
      user: user,
      tasks: tasks,

    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to load dashboard");
  }
});

app.get("/logout", renderlogout);

app.post("/add-task", add_task);

app.post("/update-task-status", update_task_status);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


