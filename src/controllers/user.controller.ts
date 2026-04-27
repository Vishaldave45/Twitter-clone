import { Request, Response } from "express";
import { db } from "../config/db";
import { getTweetsByUserId } from "../services/tweet.service";

export const getProfile = async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        return res.redirect("/signin");
    }

    const [rows]: any = await db.query("SELECT * FROM users WHERE id=?", [userId]);
    const tweets = await getTweetsByUserId(userId);

    res.render("profile", { user: rows[0], tweets });
};

export const getUserProfile = async (req: Request, res: Response) => {
    const username = req.params.username;

    const [rows]: any = await db.query("SELECT id, full_name, username, bio, avatar_path, cover_image_path, time_zone, created_at FROM users WHERE username=?", [username]);

    if (rows.length === 0) {
        return res.status(404).render("error", { title: "User not found", message: "The profile you requested does not exist." });
    }

    const tweets = await getTweetsByUserId(rows[0].id);
    res.render("user-profile", { user: rows[0], tweets });
};

export const listUsers = async (_req: Request, res: Response) => {
    const [rows]: any = await db.query("SELECT username, full_name, bio, avatar_path FROM users ORDER BY created_at DESC LIMIT 50");
    res.render("users", { users: rows });
};

export const editProfile = async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        return res.redirect("/signin");
    }

    const [rows]: any = await db.query("SELECT * FROM users WHERE id=?", [userId]);

    res.render("edit-profile", { user: rows[0] });
};

export const updateProfile = async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        return res.redirect("/signin");
    }

    const { full_name, bio, time_zone } = req.body;

    let avatarPath = null;
    let coverPath = null;

    if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (files.avatar && files.avatar[0]) {
            avatarPath = files.avatar[0].filename;
        }

        if (files.cover && files.cover[0]) {
            coverPath = files.cover[0].filename;
        }
    }

    await db.query(
        "UPDATE users SET full_name=?, bio=?, time_zone=?, avatar_path=COALESCE(?, avatar_path), cover_image_path=COALESCE(?, cover_image_path) WHERE id=?",
        [full_name, bio || null, time_zone, avatarPath, coverPath, userId]
    );

    res.redirect("/profile");
};

export const searchUser = async (req: Request, res: Response) => {
    const query = req.body.q || "";
    const [rows]: any = await db.query(
        "SELECT username, full_name, bio, avatar_path FROM users WHERE username LIKE ? OR full_name LIKE ? LIMIT 50",
        [`%${query}%`, `%${query}%`]
    );
    res.render("users", { users: rows });
};