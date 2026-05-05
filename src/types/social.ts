import { UserRecord } from "./auth";

export interface TweetRecord {
  id: number;
  user_id: number;
  content: string;
  image_path: string | null;
  created_at: Date;
  updated_at: Date;
  full_name: string;
  username: string;
  avatar_path: string | null;
  like_count: number;
  comment_count: number;
  repost_count: number;
  liked_by_me: number;
  reposted_by_me: number;
}

export interface CommentRecord {
  id: number;
  tweet_id: number;
  user_id: number;
  content: string;
  created_at: Date;
  full_name: string;
  username: string;
}

export interface ProfileStats {
  tweetCount: number;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export interface ProfilePageData {
  profile: UserRecord;
  tweets: TweetRecord[];
  stats: ProfileStats;
}
