import express from "express";

export const  ensureAuthenticated = (req, res, next)=>{
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login"); 
}

export const forwardAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.redirect("/dashboard");
    }
    next();
  };
  