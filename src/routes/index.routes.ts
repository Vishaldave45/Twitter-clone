import { Router } from "express";
import { showHome, showLanding } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", showLanding);
router.get("/home", requireAuth, showHome);

export default router;
