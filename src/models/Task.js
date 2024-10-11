import { database } from "../config/db.js"; 

export const add_task = async (req, res) => {
   if(req.isAuthenticated()) {
     
   
    const { taskName, taskDescription } = req.body;
    const userId = req.user.id; 
  
    if (!taskName || !taskDescription || !userId) {
      return res.status(400).json({ message: "Task name, description, and user ID are required" });
    }
  
    try {
      const result = await database.query(
        "INSERT INTO tasks (task_name, task_description, user_id) VALUES ($1, $2, $3) RETURNING *",
        [taskName, taskDescription, userId]
      );
  
      res.status(201).json({ message: "Task added", task: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to add task" });
    }
} }; 

export async function render_task(userId) {
  try {
    const result = await database.query("SELECT * FROM tasks WHERE user_id = $1", [userId]);
    return result.rows; 
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch tasks");
  }
}
