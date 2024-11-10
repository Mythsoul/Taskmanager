import express from "express";
import { render_meetingpage , delete_meetings , update_meetings, scheduleMeeting } from "../controllers/meetingsController.js";
import { ensureAuthenticated } from "../middlewares/authMiddleware.js";
const router = express(); 

router.get("/dashboard/user/meetings" , ensureAuthenticated , render_meetingpage);
router.post("/meetings/createmeeting" , ensureAuthenticated , scheduleMeeting);
router.post("/meetings/deletemeeting" , ensureAuthenticated , delete_meetings); 
router.post("/meetings/updatemeeting" , ensureAuthenticated , update_meetings);   
export default router ; 