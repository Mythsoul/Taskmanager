import express from "express"; 
import { database } from "../config/db.js"; 
import passport from "../config/passport.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { get_tasks_data } from "../models/Task.js";

dotenv.config();

export const add_task = async (req, res) => {
    if (req.isAuthenticated()) {
 
        const { taskName, due_date, priority } = req.body;
        const userId = req.user ? req.user.id : null; // Validate if userId exists
  
        if (!taskName || !userId) {
            return res.status(400).json({ message: "Task name and user ID are required" });
        }
  
        try {
            const response = await database.query(
                "SELECT task_name FROM tasks WHERE user_id = $1 AND task_name = $2",
                [userId, taskName]
            );
  
            if (response.rowCount > 0) {
                return res.status(400).json({ message: "Task already exists" });
            }
  
            const data = await database.query("SELECT COUNT(*) FROM tasks WHERE user_id = $1", [userId]);
            if (parseInt(data.rows[0].count, 10) >= 5) {
                return res.status(400).json({ message: "You can only add 5 tasks" });
            }
  
            const insertResult = await database.query(
                "INSERT INTO tasks (task_name, user_id, due_date, priority, status) VALUES ($1, $2, $3, $4, 'todo') RETURNING *",
                [taskName, userId, due_date, priority]
            );
  
            if (insertResult.rowCount === 0) {
                return res.status(500).json({ message: "Failed to add task to database" });
            }
            res.status(200).json({ message: "Task added successfully", task: insertResult.rows[0] });
        } catch (err) {
            console.error("Error adding task:", err);
            res.status(500).json({ message: "Failed to add task" });
        }
    } else {
        console.log("User is not authenticated.");
        return res.status(401).json({ message: "Unauthorized" });
    }
  };
  
  
  
  export const update_task_status = async (req, res) => {
    let { taskName, status , task_id } = req.body;
    const userId = req.user.id;
  
   
    taskName = taskName.trim();
    
    if (!taskName || !status) {
      return res.status(400).json({ message: "Task name and status are required" });
    }
  
    try {
      if(status === "done"){
      const result = await database.query(
        "UPDATE tasks SET status = $1 WHERE task_id = $2 AND user_id = $3",
        [status, task_id , userId]
      );
      setTimeout(async () => {
         const delete_task = await database.query("DELETE FROM tasks WHERE task_id= $1 and user_id = $2" , [task_id , userId])
        
        }, 1000000); 
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.status(200).json({ message: "Task status updated" });
  
    }else{
      const result = await database.query("UPDATE tasks SET status = $1 WHERE task_id = $2 AND user_id = $3", [status, task_id, userId]);
      console.log("Update result:", result);
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.status(200).json({ message: "Task status updated" }); 
    }
     
     
    } catch (err) {
      console.error("Error updating task status:", err);
      res.status(500).json({ message: "Failed to update task status" });
    }
  };
  
  export const delete_task = async (req, res) => { 
    const taskName = req.body.taskName; 
    const userID = req.user.id; 
    console.log(`Deleting task: ${taskName} for user ID: ${userID}`);
    try { 
        const result = await database.query(
            "DELETE FROM tasks WHERE task_name = $1 AND user_id = $2",
            [taskName, userID]
        );
        res.redirect("/dashboard?query=delete+task");
    } catch (err) { 
        console.error("Error executing delete query:", err);
        res.status(500).json({ message: "Error deleting task" });
    }
  };
  
  export const api_render_tasks = async (req, res) => {
    const userId = req.user.id;
    try {
      const result = await database.query("SELECT * FROM tasks WHERE user_id = $1", [userId]);
      res.json({ tasks: result.rows });
    } catch (err) {
      console.error("Error rendering tasks:", err);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  };
  
  export const render_tasks_page = async(req, res) => {
    const user = req.user;
    console.log(user);

    try {
        const tasks = await get_tasks_data(user.id);
console.log(tasks); 

       
        res.render("task", {
            user: user,
            tasks: tasks,
        });
    } catch (err) {
        console.error("Error loading dashboard:", err);
        res.status(500).send("Failed to load dashboard");
    }
  };


 export const edit_task = async (req , res)=>{ 
    const {taskName , due_date , priority , task_id} = req.body;
    const userId = req.user.id;
    try{ 
      const response = await database.query("Update tasks set task_name=$1 , due_date=$2 , priority=$3 where user_id=$4 and task_id = $5" , [taskName , due_date , priority , userId , task_id]);
      res.redirect("/dashboard?query=edit+task");
    }catch(err){ 
        throw err ; 
    }
 }