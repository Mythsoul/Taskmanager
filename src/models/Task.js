import express from "express";
import { database } from "../config/db.js";
import axios from "axios";
import dotenv from "dotenv";


// import OpenAI from "openai";
dotenv.config();

// const openai = new OpenAI(); 


export async function render_task(userId) {
  try {
    const result = await database.query("SELECT * FROM tasks WHERE user_id = $1 ORDER BY status", [userId]);

    const tasks = result.rows.map(task => {
      task.due_date = new Date(task.due_date).toLocaleDateString('default', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      return task;
    });

    return {
      todo: tasks.filter(task => task.status === 'todo'),
      pending: tasks.filter(task => task.status === 'pending'),
      done: tasks.filter(task => task.status === 'done'), 
      
    };
  } catch (err) {
    console.error("Error fetching tasks:", err);
    throw new Error("Failed to fetch tasks");
  }
}; 

export async function get_tasks_data(userID){ 
    try{ 
    const response = await database.query("SELECT * FROM tasks WHERE user_id = $1", [userID]);
    return response.rows; 
    }catch(err){ 
      throw err; 
    }
}
async function get_task_names(userId) {
  try {
    const response = await database.query("SELECT task_name FROM tasks WHERE user_id = $1", [userId]);
    return response.rows.map(row => row.task_name);
  } catch (error) {
    console.error("Error fetching task names:", error);
    throw new Error("Failed to fetch task names");
  }
}



// export async function generateTaskSuggestions(userId) {
//   const response = await database.query("SELECT task_name FROM tasks WHERE user_id = $1", [userId]);
//   const tasks = response.rows;
//   const taskDescriptions = tasks.map(({ task_name }) => task_name).join(", ");
//   const prompt = `hi`;

//   try {
//     console.log("on progress")
//     }
//       catch (error) {
//     if (error.response && error.response.status === 429) {
//       console.error('Rate limit exceeded. Please wait a few seconds before trying again.');
//       return "Rate limit exceeded. Please wait a few seconds before trying again."
//       setTimeout(generateTaskSuggestions, 5000); 
//     } else {
//       console.error('Error fetching task suggestions:', error);
//       return "AI suggestions cant be loaded currently"
//     }
//   }}; 
