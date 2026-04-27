export interface TweetRecord {
  id: number;
  user_id: number;
  text_content: string;
  image_path: string | null;
  like_count: number;
  comment_count: number;
  repost_count: number;
  created_at: Date;
  updated_at: Date;
  username: string;
  full_name: string;
  avatar_path: string | null;
}

export interface CreateTweetInput {
  textContent: string;
}
