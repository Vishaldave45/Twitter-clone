CREATE DATABASE IF NOT EXISTS twitter_clone;
USE twitter_clone;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(120) NOT NULL,
  username VARCHAR(30) NOT NULL UNIQUE,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  bio VARCHAR(280) DEFAULT NULL,
  avatar_path VARCHAR(255) DEFAULT NULL,
<<<<<<< HEAD
  cover_image_path VARCHAR(255) DEFAULT NULL,
  time_zone VARCHAR(50) NOT NULL,
=======
  cover_path VARCHAR(255) DEFAULT NULL,
  time_zone VARCHAR(80) NOT NULL DEFAULT 'Asia/Kolkata',
  email_verified TINYINT NOT NULL DEFAULT 0,
>>>>>>> 8b20fd3 (`Added new features and functionality to the Twitter clone application`)
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

<<<<<<< HEAD
CREATE TABLE IF NOT EXISTS tweets (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  text_content VARCHAR(280) NOT NULL,
  image_path VARCHAR(255) DEFAULT NULL,
  like_count INT UNSIGNED NOT NULL DEFAULT 0,
  comment_count INT UNSIGNED NOT NULL DEFAULT 0,
  repost_count INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
=======
CREATE TABLE IF NOT EXISTS password_reset_otps (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  otp_hash VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_password_reset_user_created (user_id, created_at),
  CONSTRAINT fk_password_reset_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tweets (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  content VARCHAR(280) NOT NULL,
  image_path VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_tweets_user_created (user_id, created_at),
  CONSTRAINT fk_tweets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tweet_likes (
  user_id INT UNSIGNED NOT NULL,
  tweet_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, tweet_id),
  CONSTRAINT fk_tweet_likes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_tweet_likes_tweet FOREIGN KEY (tweet_id) REFERENCES tweets(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tweet_comments (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  tweet_id INT UNSIGNED NOT NULL,
  content VARCHAR(280) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_tweet_comments_tweet (tweet_id),
  CONSTRAINT fk_tweet_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_tweet_comments_tweet FOREIGN KEY (tweet_id) REFERENCES tweets(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tweet_reposts (
  user_id INT UNSIGNED NOT NULL,
  tweet_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, tweet_id),
  CONSTRAINT fk_tweet_reposts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_tweet_reposts_tweet FOREIGN KEY (tweet_id) REFERENCES tweets(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS follows (
  follower_id INT UNSIGNED NOT NULL,
  followed_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (follower_id, followed_id),
  CONSTRAINT fk_follows_follower FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_follows_followed FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE
>>>>>>> 8b20fd3 (`Added new features and functionality to the Twitter clone application`)
);
