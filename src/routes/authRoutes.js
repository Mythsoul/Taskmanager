import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { database as db } from "../config/db.js";

dotenv.config();
const app = express();

const renderlogin = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  res.render("login");
};

// const postregister = async (req , res )=>{ 
//   const {username , password } = req.body;
//   if (!username || !password) {
//     res.redirect("/register?error=Username and password are required");
//   }
//   try{ 
//     const hashedpassword = await bcrypt.hashSync(password, 10);
//     const result = await db.query("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *", [username, hashedpassword]);
//     if(result.rowCount === 0){
//       res.redirect("/register?error=Failed to register");}
//   }
// }

const renderregister = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  res.render("register");
};

const google_auth = (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
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
      const id = profile.id.trim();
      const username = profile.displayName.trim();
      const hashedPassword = bcrypt.hashSync(id, 10);

      const picture = profile.photos[0].value;

      try {
        const userResult = await db.query(`SELECT * FROM users WHERE id = $1`, [id]);

        if (userResult.rows.length > 0) {
         const user = await userResult.rows[0];

          const taskResult = await db.query(`SELECT * FROM tasks WHERE user_id = $1`, [id]);

          if (taskResult.rows.length === 0) {
            await db.query(
              `INSERT INTO tasks (user_id, task_name) VALUES ($1, $2)`,
              [id, 'Sample task']
            );
          }
          return cb(null, { id, username, picture : picture});
        } else {
          const addUser = await db.query(
            `INSERT INTO users (id, username, password) VALUES ($1, $2, $3) RETURNING *`,
            [id, username, hashedPassword]
          );

         const newUser = addUser.rows[0];

          await db.query(
            `INSERT INTO tasks (user_id, task_name) VALUES ($1, $2)`,
            [id, "Sample task"]
          );
          return cb(null, { id, username,  picture : picture});
        }
      } catch (err) {
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
  passport,
};

