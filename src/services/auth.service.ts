import bcrypt from "bcrypt";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db";
import { ProfileInput, SigninInput, SignupInput, UserRecord } from "../types/auth";

export async function findUserByEmailOrUsername(login: string): Promise<UserRecord | null> {
  const [rows] = await db.query<(UserRecord & RowDataPacket)[]>(
    "SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1",
    [login, login]
  );

  return rows[0] ?? null;
}

export async function emailExists(email: string): Promise<boolean> {
  const [rows] = await db.query<RowDataPacket[]>("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
  return rows.length > 0;
}

export async function usernameExists(username: string): Promise<boolean> {
  const [rows] = await db.query<RowDataPacket[]>("SELECT id FROM users WHERE username = ? LIMIT 1", [username]);
  return rows.length > 0;
}

export async function usernameExistsForAnotherUser(username: string, userId: number): Promise<boolean> {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT id FROM users WHERE username = ? AND id <> ? LIMIT 1",
    [username, userId]
  );
  return rows.length > 0;
}

export async function createUser(input: SignupInput, avatarPath?: string): Promise<UserRecord> {
  const passwordHash = await bcrypt.hash(input.password, 12);
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO users (full_name, username, email, password_hash, bio, avatar_path, time_zone)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
<<<<<<< HEAD
    [input.fullName, input.username, input.email, passwordHash, input.bio || null, avatarPath ?? null, input.timeZone]
=======
    [
      input.fullName,
      input.username,
      input.email,
      passwordHash,
      input.bio || null,
      avatarPath ?? null,
      input.timeZone
    ]
>>>>>>> 8b20fd3 (`Added new features and functionality to the Twitter clone application`)
  );

  const [rows] = await db.query<(UserRecord & RowDataPacket)[]>("SELECT * FROM users WHERE id = ? LIMIT 1", [
    result.insertId
  ]);

  return rows[0];
}

export async function verifyUserCredentials(input: SigninInput): Promise<UserRecord | null> {
  const user = await findUserByEmailOrUsername(input.login);

  if (!user) {
    return null;
  }

  const isMatch = await bcrypt.compare(input.password, user.password_hash);
  return isMatch ? user : null;
}

export async function findUserById(id: number): Promise<UserRecord | null> {
  const [rows] = await db.query<(UserRecord & RowDataPacket)[]>("SELECT * FROM users WHERE id = ? LIMIT 1", [id]);
  return rows[0] ?? null;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const [rows] = await db.query<(UserRecord & RowDataPacket)[]>("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
  return rows[0] ?? null;
}

export async function updatePassword(userId: number, password: string): Promise<void> {
  const passwordHash = await bcrypt.hash(password, 12);
  await db.execute("UPDATE users SET password_hash = ? WHERE id = ?", [passwordHash, userId]);
}

export async function verifyPassword(userId: number, password: string): Promise<boolean> {
  const user = await findUserById(userId);
  return user ? bcrypt.compare(password, user.password_hash) : false;
}

export async function updateProfile(
  userId: number,
  input: ProfileInput,
  avatarPath?: string,
  coverPath?: string
): Promise<void> {
  await db.execute(
    `UPDATE users
     SET full_name = ?, username = ?, bio = ?, time_zone = ?,
         avatar_path = COALESCE(?, avatar_path),
         cover_path = COALESCE(?, cover_path)
     WHERE id = ?`,
    [input.fullName, input.username, input.bio || null, input.timeZone, avatarPath ?? null, coverPath ?? null, userId]
  );
}

export async function searchUsers(query: string, currentUserId: number): Promise<UserRecord[]> {
  if (!query) {
    return [];
  }

  const [rows] = await db.query<(UserRecord & RowDataPacket)[]>(
    `SELECT * FROM users
     WHERE id <> ? AND (full_name LIKE ? OR username LIKE ?)
     ORDER BY full_name ASC
     LIMIT 20`,
    [currentUserId, `%${query}%`, `%${query}%`]
  );

  return rows;
}
