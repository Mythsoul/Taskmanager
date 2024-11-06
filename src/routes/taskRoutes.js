import express from "express"; 
import { ensureAuthenticated , forwardAuthenticated } from "../middlewares/authMiddleware.js";
import { add_task, delete_task, update_task_status,  api_render_tasks  ,render_tasks_page, edit_task} from "../controllers/taskController.js";

const router = express();

router.post("/add-task", ensureAuthenticated, add_task);

router.post("/delete-task", ensureAuthenticated, delete_task);
router.post("/update-task-status", ensureAuthenticated, update_task_status);


router.post("/update-task", ensureAuthenticated, edit_task);

router.get("/user-tasks", ensureAuthenticated, render_tasks_page);

router.get("/api/user-tasks", ensureAuthenticated, api_render_tasks);


export default router ; 