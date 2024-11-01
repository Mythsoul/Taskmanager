import express from "express";
import { fetchFunFact } from "../models/fun.js";
import { render_task  } from "../models/Task.js";

export const render_homepage = async(req ,res)=>{ 
        const funfact = await fetchFunFact(); 
        res.render("index.ejs" , {funfact : funfact});
    }

export const render_dashboard = async(req , res)=>{ 
    const user = req.user;
    console.log(user);
    try {
      const tasks = await render_task(user.id);
      
      // const tasks_suggestions = await generateTaskSuggestions(user.id); 
      res.render("dashboard", {
        user: user,
        tasks: tasks,
        // tasks_suggestions: tasks_suggestions, 
      funfact : await fetchFunFact(),
      });
    } catch (err) {
      console.error("Error loading dashboard:", err);
      res.status(500).send("Failed to load dashboard");
    }
}