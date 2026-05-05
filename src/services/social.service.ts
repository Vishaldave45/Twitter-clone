import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db";
import { CommentRecord, ProfileStats, TweetRecord } from "../types/social";

function timelineSelect(currentUserId: number): [string, unknown[]] {
  return [
    `SELECT t.*, u.full_name, u.username, u.avatar_path,
      COUNT(DISTINCT l.user_id) AS like_count,
      COUNT(DISTINCT c.id) AS comment_count,
      COUNT(DISTINCT r.user_id) AS repost_count,
      MAX(CASE WHEN my_likes.user_id IS NULL THEN 0 ELSE 1 END) AS liked_by_me,
      MAX(CASE WHEN my_reposts.user_id IS NULL THEN 0 ELSE 1 END) AS reposted_by_me
     FROM tweets t
     JOIN users u ON u.id = t.user_id
     LEFT JOIN tweet_likes l ON l.tweet_id = t.id
     LEFT JOIN tweet_comments c ON c.tweet_id = t.id
     LEFT JOIN tweet_reposts r ON r.tweet_id = t.id
     LEFT JOIN tweet_likes my_likes ON my_likes.tweet_id = t.id AND my_likes.user_id = ?
     LEFT JOIN tweet_reposts my_reposts ON my_reposts.tweet_id = t.id AND my_reposts.user_id = ?`,
    [currentUserId, currentUserId]
  ];
}

export async function createTweet(userId: number, content: string, imagePath?: string): Promise<void> {
  await db.execute("INSERT INTO tweets (user_id, content, image_path) VALUES (?, ?, ?)", [
    userId,
    content,
    imagePath ?? null
  ]);
}

export async function deleteOwnTweet(userId: number, tweetId: number): Promise<void> {
  await db.execute("DELETE FROM tweets WHERE id = ? AND user_id = ?", [tweetId, userId]);
}

export async function getTimeline(userId: number): Promise<TweetRecord[]> {
  const [baseSql, params] = timelineSelect(userId);
  const [rows] = await db.query<(TweetRecord & RowDataPacket)[]>(
    `${baseSql}
     WHERE t.user_id = ?
        OR t.user_id IN (SELECT followed_id FROM follows WHERE follower_id = ?)
     GROUP BY t.id
     ORDER BY t.created_at DESC
     LIMIT 50`,
    [...params, userId, userId]
  );

  return rows;
}

export async function getUserTweets(profileUserId: number, currentUserId: number): Promise<TweetRecord[]> {
  const [baseSql, params] = timelineSelect(currentUserId);
  const [rows] = await db.query<(TweetRecord & RowDataPacket)[]>(
    `${baseSql}
     WHERE t.user_id = ?
     GROUP BY t.id
     ORDER BY t.created_at DESC
     LIMIT 50`,
    [...params, profileUserId]
  );

  return rows;
}

export async function toggleLike(userId: number, tweetId: number): Promise<void> {
  const [existing] = await db.query<RowDataPacket[]>(
    "SELECT user_id FROM tweet_likes WHERE user_id = ? AND tweet_id = ? LIMIT 1",
    [userId, tweetId]
  );

  if (existing.length > 0) {
    await db.execute("DELETE FROM tweet_likes WHERE user_id = ? AND tweet_id = ?", [userId, tweetId]);
    return;
  }

  await db.execute("INSERT IGNORE INTO tweet_likes (user_id, tweet_id) VALUES (?, ?)", [userId, tweetId]);
}

export async function toggleRepost(userId: number, tweetId: number): Promise<void> {
  const [existing] = await db.query<RowDataPacket[]>(
    "SELECT user_id FROM tweet_reposts WHERE user_id = ? AND tweet_id = ? LIMIT 1",
    [userId, tweetId]
  );

  if (existing.length > 0) {
    await db.execute("DELETE FROM tweet_reposts WHERE user_id = ? AND tweet_id = ?", [userId, tweetId]);
    return;
  }

  await db.execute("INSERT IGNORE INTO tweet_reposts (user_id, tweet_id) VALUES (?, ?)", [userId, tweetId]);
}

export async function addComment(userId: number, tweetId: number, content: string): Promise<void> {
  await db.execute("INSERT INTO tweet_comments (user_id, tweet_id, content) VALUES (?, ?, ?)", [
    userId,
    tweetId,
    content
  ]);
}

export async function getComments(tweetId: number): Promise<CommentRecord[]> {
  const [rows] = await db.query<(CommentRecord & RowDataPacket)[]>(
    `SELECT c.*, u.full_name, u.username
     FROM tweet_comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.tweet_id = ?
     ORDER BY c.created_at ASC`,
    [tweetId]
  );

  return rows;
}

export async function toggleFollow(followerId: number, followedId: number): Promise<void> {
  if (followerId === followedId) {
    return;
  }

  const [existing] = await db.query<RowDataPacket[]>(
    "SELECT follower_id FROM follows WHERE follower_id = ? AND followed_id = ? LIMIT 1",
    [followerId, followedId]
  );

  if (existing.length > 0) {
    await db.execute("DELETE FROM follows WHERE follower_id = ? AND followed_id = ?", [followerId, followedId]);
    return;
  }

  await db.execute("INSERT IGNORE INTO follows (follower_id, followed_id) VALUES (?, ?)", [followerId, followedId]);
}

export async function getProfileStats(profileUserId: number, currentUserId: number): Promise<ProfileStats> {
  const [[tweetCount], [followerCount], [followingCount], [isFollowing]] = await Promise.all([
    db.query<RowDataPacket[]>("SELECT COUNT(*) AS count FROM tweets WHERE user_id = ?", [profileUserId]),
    db.query<RowDataPacket[]>("SELECT COUNT(*) AS count FROM follows WHERE followed_id = ?", [profileUserId]),
    db.query<RowDataPacket[]>("SELECT COUNT(*) AS count FROM follows WHERE follower_id = ?", [profileUserId]),
    db.query<RowDataPacket[]>(
      "SELECT follower_id FROM follows WHERE follower_id = ? AND followed_id = ? LIMIT 1",
      [currentUserId, profileUserId]
    )
  ]);

  return {
    tweetCount: Number(tweetCount[0]?.count ?? 0),
    followerCount: Number(followerCount[0]?.count ?? 0),
    followingCount: Number(followingCount[0]?.count ?? 0),
    isFollowing: isFollowing.length > 0
  };
}

export async function tweetExists(tweetId: number): Promise<boolean> {
  const [rows] = await db.query<RowDataPacket[]>("SELECT id FROM tweets WHERE id = ? LIMIT 1", [tweetId]);
  return rows.length > 0;
}
