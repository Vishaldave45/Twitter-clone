import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db";
import { CreateTweetInput, TweetRecord } from "../types/tweet";

export async function getFeedTweets(): Promise<TweetRecord[]> {
  const [rows] = await db.query<(TweetRecord & RowDataPacket)[]>(
    `SELECT t.*, u.username, u.full_name, u.avatar_path
     FROM tweets t
     JOIN users u ON t.user_id = u.id
     ORDER BY t.created_at DESC`
  );

  return rows;
}

export async function createTweet(userId: number, input: CreateTweetInput, imagePath?: string): Promise<TweetRecord> {
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO tweets (user_id, text_content, image_path, like_count, comment_count, repost_count)
     VALUES (?, ?, ?, 0, 0, 0)`,
    [userId, input.textContent || null, imagePath ?? null]
  );

  const [rows] = await db.query<(TweetRecord & RowDataPacket)[]>(
    `SELECT t.*, u.username, u.full_name, u.avatar_path
     FROM tweets t
     JOIN users u ON t.user_id = u.id
     WHERE t.id = ?
     LIMIT 1`,
    [(result as ResultSetHeader).insertId]
  );

  return rows[0];
}

export async function getTweetById(tweetId: number): Promise<TweetRecord | null> {
  const [rows] = await db.query<(TweetRecord & RowDataPacket)[]>(
    `SELECT t.*, u.username, u.full_name, u.avatar_path
     FROM tweets t
     JOIN users u ON t.user_id = u.id
     WHERE t.id = ?
     LIMIT 1`,
    [tweetId]
  );

  return rows[0] ?? null;
}

export async function updateTweet(tweetId: number, userId: number, textContent: string, imagePath?: string): Promise<void> {
  if (imagePath) {
    await db.query(
      `UPDATE tweets SET text_content = ?, image_path = COALESCE(?, image_path), updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`,
      [textContent, imagePath, tweetId, userId]
    );
  } else {
    await db.query(
      `UPDATE tweets SET text_content = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`,
      [textContent, tweetId, userId]
    );
  }
}

export async function deleteTweet(tweetId: number, userId: number): Promise<void> {
  await db.query("DELETE FROM tweets WHERE id = ? AND user_id = ?", [tweetId, userId]);
}

export async function getTweetsByUserId(userId: number): Promise<TweetRecord[]> {
  const [rows] = await db.query<(TweetRecord & RowDataPacket)[]>(
    `SELECT t.*, u.username, u.full_name, u.avatar_path
     FROM tweets t
     JOIN users u ON t.user_id = u.id
     WHERE t.user_id = ?
     ORDER BY t.created_at DESC`,
    [userId]
  );

  return rows;
}
