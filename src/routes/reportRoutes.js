import express from "express";
import { delete_report , add_report , update_report, render_reports_page  } from "../controllers/ReportsController.js";
import { ensureAuthenticated  } from "../middlewares/authMiddleware.js";

const router = express(); 

router.post("/createreport" , ensureAuthenticated , add_report);  
router.post("/deletereport" , ensureAuthenticated , delete_report);
router.post("/updatereport" , ensureAuthenticated , update_report);
router.get("/dashboard/user/reports" , ensureAuthenticated , render_reports_page);  


export default router ;