import bcrypt from "bcrypt";
import { RowDataPacket } from "mysql2";
import { db } from "../config/db";

export interface ResetOtpRecord {
  id: number;
  user_id: number;
  otp_hash: string;
  expires_at: Date;
  used_at: Date | null;
  created_at: Date;
}

export interface OtpIssue {
  otp: string;
  expiresAt: Date;
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createPasswordResetOtp(userId: number): Promise<OtpIssue> {
  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

  await db.execute("UPDATE password_reset_otps SET used_at = NOW() WHERE user_id = ? AND used_at IS NULL", [userId]);
  await db.execute("INSERT INTO password_reset_otps (user_id, otp_hash, expires_at) VALUES (?, ?, ?)", [
    userId,
    otpHash,
    expiresAt
  ]);

  return { otp, expiresAt };
}

export async function getLatestPasswordResetOtp(userId: number): Promise<ResetOtpRecord | null> {
  const [rows] = await db.query<(ResetOtpRecord & RowDataPacket)[]>(
    `SELECT * FROM password_reset_otps
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId]
  );

  return rows[0] ?? null;
}

export async function verifyPasswordResetOtp(userId: number, otp: string): Promise<ResetOtpRecord | null> {
  const record = await getLatestPasswordResetOtp(userId);

  if (!record || record.used_at || record.expires_at.getTime() < Date.now()) {
    return null;
  }

  const matches = await bcrypt.compare(otp, record.otp_hash);
  return matches ? record : null;
}

export async function markPasswordResetOtpUsed(id: number): Promise<void> {
  await db.execute("UPDATE password_reset_otps SET used_at = NOW() WHERE id = ?", [id]);
}
