import bcrypt from "bcrypt";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db";
import { SigninInput, SignupInput, UserRecord } from "../types/auth";

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

export async function createUser(input: SignupInput, avatarPath?: string): Promise<UserRecord> {
  const passwordHash = await bcrypt.hash(input.password, 12);
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO users (full_name, username, email, password_hash, bio, avatar_path, time_zone)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [input.fullName, input.username, input.email, passwordHash, input.bio || null, avatarPath ?? null, input.timeZone]
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
