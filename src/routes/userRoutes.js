import express from "express";
import { render_dashboard , render_homepage   } from "../controllers/userController.js"; 
import { ensureAuthenticated } from "../middlewares/authMiddleware.js";
const router = express(); 

router.get("/" , render_homepage); 
router.get("/dashboard" , ensureAuthenticated , render_dashboard);

export default router ; 