import { Router } from "express";
import {
  showSignup,
  signup,
  showSignin,
  signin,
  logout,
  resendOtp,
  resetPassword,
  verifyOtp,
  forgotPassword,
  showEmailSimulation
} from "../controllers/auth.controller";
import { redirectIfAuthenticated } from "../middlewares/auth.middleware";
import { uploadAvatarMiddleware } from "../middlewares/upload.middleware";

const router = Router();

router.get("/signup", redirectIfAuthenticated, showSignup);
router.post("/signup", redirectIfAuthenticated, uploadAvatarMiddleware, signup);
router.get("/signin", redirectIfAuthenticated, showSignin);
router.post("/signin", redirectIfAuthenticated, signin);
router.post("/logout", logout);
router.get("/forgot-password", (_req, res) => {res.render("forgot-password")});
router.post("/forgot-password",forgotPassword);
router.get("/email-simulation", showEmailSimulation);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.get("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

export default router;