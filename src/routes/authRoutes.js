import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

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

const google_auth = (req, res) => {
  passport.authenticate("google", { scope: ["profile"] })(req, res);
};

const google_callback = (req, res) => {
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/dashboard",
  });
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
    function (accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
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
