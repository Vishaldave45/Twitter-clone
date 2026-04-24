export interface SignupInput {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  bio: string;
}

export interface SigninInput {
  login: string;
  password: string;
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
  created_at: Date;
  updated_at: Date;
}
