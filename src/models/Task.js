import { database } from "../config/db.js";

export const add_task = async (req, res) => {
  if (req.isAuthenticated()) {
    const { taskName} = req.body;
    const userId = req.user.id;

    if (!taskName || !userId) {
      return res.status(400).json({ message: "Task name and user ID are required" });
    }

    try {
      const result = await database.query(
        "INSERT INTO tasks (task_name, user_id, status) VALUES ($1, $2 ,'todo') RETURNING *",
        [taskName,  userId]
      );
      res.status(201).json({ message: "Task added", task: result.rows[0] });
    } catch (err) {
      console.error(err);
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
    console.error(err);
    res.status(500).json({ message: "Failed to update task status" });
  }
};

export async function render_task(userId) {
  try {
    const result = await database.query("SELECT * FROM tasks WHERE user_id = $1 ORDER BY status", [userId]);
    const todo = result.rows.filter(task => task.status === 'todo');
    const pending = result.rows.filter(task => task.status === 'pending');
    const done = result.rows.filter(task => task.status === 'done');
    return { todo, pending, done };
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch tasks");
  }
}

