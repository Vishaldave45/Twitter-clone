export interface SignupInput {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  bio: string;
  timeZone: string;
}

export interface SigninInput {
  login: string;
  password: string;
  rememberMe: boolean;
}

export type ValidationErrors<T extends string> = Partial<Record<T, string>>;

export interface UserRecord {
  id: number;
  full_name: string;
  username: string;
  email: string;
  password_hash: string;
  bio: string | null;
  avatar_path: string | null;
<<<<<<< HEAD
  cover_image_path: string | null;
  time_zone: string;
=======
  cover_path: string | null;
  time_zone: string;
  email_verified: number;
>>>>>>> 8b20fd3 (`Added new features and functionality to the Twitter clone application`)
  created_at: Date;
  updated_at: Date;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface VerifyOtpInput {
  email: string;
  otp: string;
}

export interface ResetPasswordInput {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileInput {
  fullName: string;
  username: string;
  bio: string;
  timeZone: string;
}
