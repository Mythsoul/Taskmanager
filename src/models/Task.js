import { database } from "../config/db.js";
import axios from "axios";
import dotenv from "dotenv";
import OpenAI from "openai";
dotenv.config();

const openai = new OpenAI(); 

export const add_task = async (req, res) => {
  if (req.isAuthenticated()) {
    const { taskName, due_date } = req.body;
    const userId = req.user.id;

    if (!taskName || !userId) {
      return res.status(400).json({ message: "Task name and user ID are required" });
    }

    try {
      const data = await database.query("SELECT COUNT(*) FROM tasks WHERE user_id = $1", [userId]);
      if (parseInt(data.rows[0].count, 10) >= 5) {
        return res.status(400).json({ message: "You can only add 5 tasks" });
      }

      await database.query(
        "INSERT INTO tasks (task_name, user_id, due_date, status) VALUES ($1, $2, $3, 'todo') RETURNING *",
        [taskName, userId, due_date]
      );
      res.redirect("/dashboard");
    } catch (err) {
      console.error("Error adding task:", err);
      res.status(500).json({ message: "Failed to add task" });
    }
  }
};

export const update_task_status = async (req, res) => {
  const { taskName, status } = req.body;
  const userId = req.user.id;

  if (!taskName || !status) {
    return res.status(400).json({ message: "Task name and status are required" });
  }

  try {
    const result = await database.query(
      "UPDATE tasks SET status = $1 WHERE task_name = $2 AND user_id = $3 RETURNING *",
      [status, taskName, userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task status updated", task: result.rows[0] });
  } catch (err) {
    console.error("Error updating task status:", err);
    res.status(500).json({ message: "Failed to update task status" });
  }
};

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
      done: tasks.filter(task => task.status === 'done')
    };
  } catch (err) {
    console.error("Error fetching tasks:", err);
    throw new Error("Failed to fetch tasks");
  }
}

// async function get_task_names(userId) {
//   try {
//     const response = await database.query("SELECT task_name FROM tasks WHERE user_id = $1", [userId]);
//     return response.rows.map(row => row.task_name);
//   } catch (error) {
//     console.error("Error fetching task names:", error);
//     throw new Error("Failed to fetch task names");
//   }
// }

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


export async function generateTaskSuggestions(userId) {
  const response = await database.query("SELECT task_name FROM tasks WHERE user_id = $1", [userId]);
  const tasks = response.rows;
  
  const taskDescriptions = tasks.map(({ task_name }) => task_name).join(", ");
  const prompt = `Based on these tasks: ${taskDescriptions}, suggest three practical and helpful related tasks.`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-3.5-turbo",
    });
      return completion;

  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.error('Rate limit exceeded. Please wait a few seconds before trying again.');
      return "Rate limit exceeded. Please wait a few seconds before trying again."
      setTimeout(generateTaskSuggestions, 5000); 
    } else {
      console.error('Error fetching task suggestions:', error);
      return "AI suggestions cant be loaded currently"
    }
  }}


// export async function suggestRelatedTasks(req, res) {
//   const userId = req.user.id;
//   try {
//     const tasks = await get_task_names(userId);
//     const suggestions = await generateTaskSuggestions(tasks);
//     res.json({ suggestions });
//   } catch (error) {
//     console.error("Error generating task suggestions:", error);
//     res.status(500).json({ message: "Failed to generate task suggestions" });
//   }

// suggestRelatedTasks;
export const render_tasks_page = (req, res) => {
  res.render("task.ejs");
};
