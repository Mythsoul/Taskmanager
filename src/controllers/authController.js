import express from "express";
import dotenv from "dotenv";
import { database as db } from "../config/db.js";
import passport from "../config/passport.js";

export const  renderlogin = (req, res) => {
    res.render("login");
  };


  export const renderregister = (req, res) => {
    if (req.isAuthenticated()) {
      return res.redirect("/dashboard");
    }
    res.render("register");
  };
  
  export const google_auth = (req, res, next) => {
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
  };
  
  export const google_callback = (req, res, next) => {
    passport.authenticate("google", {
      failureRedirect: "/login",
      successRedirect: "/dashboard",
    })(req, res, next);
  };

  export const renderlogout = (req, res) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  };
  
  