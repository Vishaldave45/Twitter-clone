import { Router } from "express";
import {
  changePassword,
  commentTweet,
  createTweetPost,
  deleteTweetPost,
  editProfile,
  followProfile,
  forgotPassword,
  likeTweet,
  showSignup,
  signup,
  showSignin,
  signin,
  logout,
<<<<<<< HEAD
  resendOtp,
  resetPassword,
  verifyOtp,
  forgotPassword,
  showEmailSimulation
} from "../controllers/auth.controller";
import { redirectIfAuthenticated } from "../middlewares/auth.middleware";
import { uploadAvatarMiddleware } from "../middlewares/upload.middleware";
=======
  repostTweet,
  resendOtp,
  resetPassword,
  search,
  showChangePassword,
  showEditProfile,
  showForgotPassword,
  showProfile,
  showVerifyOtp,
  verifyOtp
} from "../controllers/auth.controller";
import { redirectIfAuthenticated, requireAuth } from "../middlewares/auth.middleware";
import { uploadAvatar, uploadImages } from "../middlewares/upload.middleware";
>>>>>>> 8b20fd3 (`Added new features and functionality to the Twitter clone application`)

const router = Router();

router.get("/signup", redirectIfAuthenticated, showSignup);
router.post("/signup", redirectIfAuthenticated, uploadAvatarMiddleware, signup);
router.get("/signin", redirectIfAuthenticated, showSignin);
router.post("/signin", redirectIfAuthenticated, signin);
router.get("/forgot-password", redirectIfAuthenticated, showForgotPassword);
router.post("/forgot-password", redirectIfAuthenticated, forgotPassword);
router.get("/verify-otp", redirectIfAuthenticated, showVerifyOtp);
router.post("/verify-otp", redirectIfAuthenticated, verifyOtp);
router.post("/reset-password", redirectIfAuthenticated, resetPassword);
router.post("/resend-otp", redirectIfAuthenticated, resendOtp);
router.post("/logout", logout);
<<<<<<< HEAD
router.get("/forgot-password", (_req, res) => {res.render("forgot-password")});
router.post("/forgot-password",forgotPassword);
router.get("/email-simulation", showEmailSimulation);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.get("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
=======
router.get("/profile/edit", requireAuth, showEditProfile);
router.post(
  "/profile/edit",
  requireAuth,
  uploadImages.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cover", maxCount: 1 }
  ]),
  editProfile
);
router.get("/profile/:username", requireAuth, showProfile);
router.post("/profile/:username/follow", requireAuth, followProfile);
router.get("/change-password", requireAuth, showChangePassword);
router.post("/change-password", requireAuth, changePassword);
router.post("/tweets", requireAuth, uploadImages.single("image"), createTweetPost);
router.post("/tweets/:id/delete", requireAuth, deleteTweetPost);
router.post("/tweets/:id/like", requireAuth, likeTweet);
router.post("/tweets/:id/repost", requireAuth, repostTweet);
router.post("/tweets/:id/comments", requireAuth, commentTweet);
router.get("/search", requireAuth, search);
>>>>>>> 8b20fd3 (`Added new features and functionality to the Twitter clone application`)

export default router;