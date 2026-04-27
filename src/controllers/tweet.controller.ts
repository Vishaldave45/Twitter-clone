import { Request, Response } from "express";
import { createTweet, deleteTweet, getTweetById, updateTweet } from "../services/tweet.service";

export const createNewTweet = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.redirect("/signin");
    return;
  }

  const textContent = String(req.body.text_content || "").trim();
  const imagePath = req.file ? req.file.filename : undefined;

  if (!textContent) {
    res.redirect("/home");
    return;
  }

  await createTweet(userId, { textContent }, imagePath);
  res.redirect("/home");
};

export const showEditTweet = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const tweetId = Number(req.params.id);
  const tweet = await getTweetById(tweetId);

  if (!tweet || tweet.user_id !== userId) {
    res.status(404).render("error", { title: "Tweet not found", message: "Tweet not found or you are not authorized." });
    return;
  }

  res.render("edit-tweet", { tweet });
};

export const updateExistingTweet = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const tweetId = Number(req.params.id);
  const textContent = String(req.body.text_content || "").trim();
  const imagePath = req.file ? req.file.filename : undefined;

  if (!userId) {
    res.redirect("/signin");
    return;
  }

  if (!textContent) {
    res.redirect(`/tweets/${tweetId}/edit`);
    return;
  }

  await updateTweet(tweetId, userId, textContent, imagePath);
  res.redirect("/home");
};

export const deleteOwnTweet = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const tweetId = Number(req.params.id);

  if (!userId) {
    res.redirect("/signin");
    return;
  }

  await deleteTweet(tweetId, userId);
  res.redirect("/home");
};
