import express from "express";
import dotenv from "dotenv";
import pg from "pg";
import path from "path";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { database } from "./src/config/db.js";
import { fileURLToPath } from "url";
import session from "express-session";
import { add_task } from "./src/models/Task.js";
import {
  renderlogin,
  renderregister,
  google_auth,
  google_callback,
  renderlogout,
} from "./src/routes/authRoutes.js";
import { render_task } from "./src/models/Task.js";
const app = express();
const port = 3000;

dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);

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
  
  try {
    const tasks = await render_task(user.id); 
    console.log(tasks);
    res.render("dashboard", {
      user: user,
      tasks: tasks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to load dashboard");} 
});


app.get("/logout", renderlogout);
app.post("/add-task",
 add_task);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
