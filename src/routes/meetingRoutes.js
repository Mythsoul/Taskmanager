import express from "express";
import { render_meetingpage } from "../controllers/meetingsController.js";
import { ensureAuthenticated } from "../middlewares/authMiddleware.js";
const router = express(); 

router.get("/dashboard/user/meetings" , ensureAuthenticated , render_meetingpage);

export default router ; 