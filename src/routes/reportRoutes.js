import express from "express";
import { delete_report , add_report , update_report  } from "../controllers/ReportsController.js";
import { ensureAuthenticated  } from "../middlewares/authMiddleware.js";

const router = express(); 

router.post("/createreport" , ensureAuthenticated , add_report);  
router.get("/deletereport/:id" , ensureAuthenticated , delete_report);
router.post("/updatereport" , ensureAuthenticated , update_report);  


export default router ;