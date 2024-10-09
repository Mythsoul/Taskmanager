import express from "express";
import dotenv from "dotenv";
import pg from "pg";
import path from "path";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {database} from "./src/config/db.js";
import { fileURLToPath } from "url";
import session from "express-session";
import authRoutes from "./src/routes/authRoutes.js";

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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    const user = {
      displayName: req.user.displayName,
      name: req.user.name.givenName,
      email: req.user.emails[0].value,
      picture: req.user.photos[0].value
    };
    res.render("dashboard.ejs", { user : user });
  }else{
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

app.use(authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});





