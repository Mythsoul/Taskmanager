import express from "express";
import { render_meetingpage , delete_meetings , update_meetings } from "../controllers/meetingsController.js";
import { ensureAuthenticated } from "../middlewares/authMiddleware.js";
const router = express(); 

router.get("/dashboard/user/meetings" , ensureAuthenticated , render_meetingpage);
router.post("/meetings/deletemeeting" , ensureAuthenticated , delete_meetings); 
router.post("/meetings/updatemeeting" , ensureAuthenticated , update_meetings);   
export default router ; 