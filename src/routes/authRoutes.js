import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { database as db } from "../config/db.js";
import bcrypt from "bcrypt";
dotenv.config();
const app = express();

const renderlogin = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  res.render("login");
};

const renderregister = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  res.render("register");
};

const google_auth = (req, res, next) => {
  passport.authenticate("google", { scope: ["profile"] })(req, res, next);
};


const google_callback = (req, res, next) => {
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/dashboard",
  })(req, res, next);
};
const renderlogout = (req, res) => {
  req.logout();
  res.redirect("/login");
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/dashboard",
    },
    async function (accessToken, refreshToken, profile, cb) {
      const id = profile.id.trim(); // Google user ID
      const username = profile.displayName.trim(); // User's display name
      const hashedPassword = bcrypt.hashSync(id, 10); // Hashing the user ID as a password for consistency

      try {
        // Check if the user exists in the users table
        const userResult = await db.query(`SELECT * FROM users WHERE id = $1`, [id]);

        if (userResult.rows.length > 0) {
          // User exists, proceed to log in
          const user = userResult.rows[0];

          // Check if the task record exists for the user
          const taskResult = await db.query(`SELECT * FROM tasks WHERE user_id = $1`, [id]);

          if (taskResult.rows.length === 0) {
            // Task does not exist, insert a new task record for the user
            await db.query(
              `INSERT INTO tasks (user_id, task_name) VALUES ($1, $2)`,
              [id, 'Sample task'] // Placeholder task name
            );
          }

          return cb(null, user);
        } else {
          // User does not exist, insert into users table
          const addUser = await db.query(
            `INSERT INTO users (id, username, password) VALUES ($1, $2, $3) RETURNING *`,
            [id, username, hashedPassword] // Store the user ID, username, and hashed password
          );

          const newUser = addUser.rows[0];

          // Insert a task for the new user
          await db.query(
            `INSERT INTO tasks (user_id , task_name) VALUES ($1 , $2)`,
            [id , "Sample task"] 
          );

          return cb(null, newUser);
        }
      } catch (err) {
        console.log(err);
        return cb(err);
      }
    }
  )
);




passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

export {
  renderlogin,
  renderregister,
  google_auth,
  google_callback,
  renderlogout,
};

