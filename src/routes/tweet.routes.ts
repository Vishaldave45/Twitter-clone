import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { uploadTweetImage } from "../middlewares/upload.middleware";
import {
  createNewTweet,
  deleteOwnTweet,
  likeTweet,
  repostTweet,
  showEditTweet,
  showShareTweet,
  showTweetDetails,
  submitTweetComment,
  updateExistingTweet
} from "../controllers/tweet.controller";

const router = Router();

router.post("/tweets", requireAuth, uploadTweetImage, createNewTweet);
router.get("/tweets/:id/edit", requireAuth, showEditTweet);
router.post("/tweets/:id/edit", requireAuth, uploadTweetImage, updateExistingTweet);
router.post("/tweets/:id/delete", requireAuth, deleteOwnTweet);
router.get("/tweets/:id", requireAuth, showTweetDetails);
router.post("/tweets/:id/like", requireAuth, likeTweet);
router.post("/tweets/:id/comments", requireAuth, submitTweetComment);
router.post("/tweets/:id/repost", requireAuth, repostTweet);
router.get("/tweets/:id/share", requireAuth, showShareTweet);

export default router;
