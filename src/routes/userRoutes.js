import express from "express";
import { render_dashboard , render_homepage, render_usermenu   } from "../controllers/userController.js"; 
import { ensureAuthenticated } from "../middlewares/authMiddleware.js";
const router = express(); 

router.get("/" , render_homepage); 
router.get("/dashboard" , ensureAuthenticated , render_dashboard);
router.get("/dashboard/usermenu" , ensureAuthenticated , render_usermenu);
export default router ; 