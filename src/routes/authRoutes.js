import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
export default router;

router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] }
    ));


router.get(
  "/auth/google/dashboard",
  passport.authenticate("google", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  }), 
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/dashboard", 
    },
    function verify(accessToken, refreshToken, profile, done) {
     console.log(profile)

      done(null, profile );
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

