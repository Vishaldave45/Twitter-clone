import { Router } from "express";
import { requireAuth as protect } from "../middlewares/auth.middleware";
import { uploadProfile } from "../middlewares/upload.middleware";

import {
    getProfile,
    getUserProfile,
    editProfile,
    updateProfile,
    listUsers
} from "../controllers/user.controller";

const router = Router();

router.get("/profile", protect, getProfile);
router.get("/profile/edit", protect, editProfile);
router.post("/profile/edit", protect, uploadProfile, updateProfile);
router.get("/users", protect, listUsers);
router.get("/user/:username", getUserProfile);

export default router;