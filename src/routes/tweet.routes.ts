import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { uploadTweetImage } from "../middlewares/upload.middleware";
import {
  createNewTweet,
  deleteOwnTweet,
  showEditTweet,
  updateExistingTweet
} from "../controllers/tweet.controller";

const router = Router();

router.post("/tweets", requireAuth, uploadTweetImage, createNewTweet);
router.get("/tweets/:id/edit", requireAuth, showEditTweet);
router.post("/tweets/:id/edit", requireAuth, uploadTweetImage, updateExistingTweet);
router.post("/tweets/:id/delete", requireAuth, deleteOwnTweet);

export default router;
