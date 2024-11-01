import express from "express";
import { renderlogin , renderlogout , renderregister ,  google_auth , google_callback } from "../controllers/authController.js";
import { ensureAuthenticated , forwardAuthenticated } from "../middlewares/authMiddleware.js";

const router = express();

router.get("/login", forwardAuthenticated, renderlogin);
router.get("/register", forwardAuthenticated, renderregister);

router.get("/auth/google", forwardAuthenticated, google_auth);
router.get("/auth/google/dashboard", forwardAuthenticated, google_callback);

router.get("/logout", ensureAuthenticated, renderlogout);

export default router;