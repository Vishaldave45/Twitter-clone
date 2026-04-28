import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db";
import { CreateTweetInput, CommentRecord, TweetRecord } from "../types/tweet";

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

export async function  getTweetCounts(tweetId: number): Promise<{ likeCount: number; commentCount: number; repostCount: number } | null> {
  const [rows] = await db.query<{ like_count: number; comment_count: number; repost_count: number } & RowDataPacket[]>(
    `SELECT like_count, comment_count, repost_count FROM tweets WHERE id = ?`,
    [tweetId]
  );

  if (rows.length === 0) {
    return null;
  }

  return {
    likeCount: rows[0].like_count,
    commentCount: rows[0].comment_count,
    repostCount: rows[0].repost_count,
  };
}

export async function getLikedTweetIdsByUser(userId: number): Promise<number[]> {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT tweet_id FROM likes WHERE user_id = ?`,
    [userId]
  );

  return rows.map((row) => row.tweet_id);
}

export async function toggleTweetLike(userId: number, tweetId: number): Promise<{ liked: boolean; likeCount: number }> {
  const [existingRows] = await db.query<RowDataPacket[]>(
    `SELECT id FROM likes WHERE tweet_id = ? AND user_id = ?`,
    [tweetId, userId]
  );

  if (existingRows.length > 0) {
    await db.query(`DELETE FROM likes WHERE tweet_id = ? AND user_id = ?`, [tweetId, userId]);
    await db.query(`UPDATE tweets SET like_count = GREATEST(like_count - 1, 0) WHERE id = ?`, [tweetId]);
    const [updatedRows] = await db.query<RowDataPacket[]>(`SELECT like_count FROM tweets WHERE id = ?`, [tweetId]);
    return {
      liked: false,
      likeCount: updatedRows[0]?.like_count ?? 0
    };
  }

  await db.query(`INSERT INTO likes (tweet_id, user_id) VALUES (?, ?)`, [tweetId, userId]);
  await db.query(`UPDATE tweets SET like_count = like_count + 1 WHERE id = ?`, [tweetId]);
  const [updatedRows] = await db.query<RowDataPacket[]>(`SELECT like_count FROM tweets WHERE id = ?`, [tweetId]);

  return {
    liked: true,
    likeCount: updatedRows[0]?.like_count ?? 0
  };
}

export async function getTweetComments(tweetId: number): Promise<CommentRecord[]> {
  const [rows] = await db.query<(CommentRecord & RowDataPacket)[]>(
    `SELECT c.*, u.username, u.full_name, u.avatar_path
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.tweet_id = ?
     ORDER BY c.created_at DESC`,
    [tweetId]
  );

  return rows;
}

export async function createTweetComment(userId: number, tweetId: number, textContent: string): Promise<void> {
  await db.query(
    `INSERT INTO comments (tweet_id, user_id, text_content) VALUES (?, ?, ?)`,
    [tweetId, userId, textContent]
  );

  await db.query(`UPDATE tweets SET comment_count = comment_count + 1 WHERE id = ?`, [tweetId]);
}

export async function createTweetRepost(userId: number, tweetId: number): Promise<number> {
  const [existingRows] = await db.query<RowDataPacket[]>(
    `SELECT id FROM reposts WHERE tweet_id = ? AND user_id = ?`,
    [tweetId, userId]
  );

  if (existingRows.length > 0) {
    return (await getTweetCounts(tweetId))?.repostCount ?? 0;
  }

  await db.query(`INSERT INTO reposts (tweet_id, user_id) VALUES (?, ?)`, [tweetId, userId]);
  await db.query(`UPDATE tweets SET repost_count = repost_count + 1 WHERE id = ?`, [tweetId]);
  const [rows] = await db.query<RowDataPacket[]>(`SELECT repost_count FROM tweets WHERE id = ?`, [tweetId]);

  return rows[0]?.repost_count ?? 0;
}

