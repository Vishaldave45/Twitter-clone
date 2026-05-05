import {
  ChangePasswordInput,
  ForgotPasswordInput,
  ProfileInput,
  ResetPasswordInput,
  SigninInput,
  SignupInput,
  ValidationErrors,
  VerifyOtpInput
} from "../types/auth";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^(?=.{4,30}$)[a-zA-Z0-9_]+$/;

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function sanitizeSignupInput(body: Record<string, unknown>): SignupInput {
  return {
    fullName: normalizeText(body.fullName),
    username: normalizeText(body.username).toLowerCase(),
    email: normalizeText(body.email).toLowerCase(),
    password: typeof body.password === "string" ? body.password : "",
    confirmPassword: typeof body.confirmPassword === "string" ? body.confirmPassword : "",
    bio: normalizeText(body.bio),
<<<<<<< HEAD
    timeZone: normalizeText(body.timeZone)
=======
    timeZone: normalizeText(body.timeZone) || "Asia/Kolkata"
>>>>>>> 8b20fd3 (`Added new features and functionality to the Twitter clone application`)
  };
}

export function sanitizeSigninInput(body: Record<string, unknown>): SigninInput {
  return {
    login: normalizeText(body.login).toLowerCase(),
    password: typeof body.password === "string" ? body.password : "",
    rememberMe: body.rememberMe === "on"
  };
}

export function sanitizeForgotPasswordInput(body: Record<string, unknown>): ForgotPasswordInput {
  return {
    email: normalizeText(body.email).toLowerCase()
  };
}

export function sanitizeVerifyOtpInput(body: Record<string, unknown>): VerifyOtpInput {
  return {
    email: normalizeText(body.email).toLowerCase(),
    otp: normalizeText(body.otp)
  };
}

export function sanitizeResetPasswordInput(body: Record<string, unknown>): ResetPasswordInput {
  return {
    email: normalizeText(body.email).toLowerCase(),
    otp: normalizeText(body.otp),
    password: typeof body.password === "string" ? body.password : "",
    confirmPassword: typeof body.confirmPassword === "string" ? body.confirmPassword : ""
  };
}

export function sanitizeChangePasswordInput(body: Record<string, unknown>): ChangePasswordInput {
  return {
    currentPassword: typeof body.currentPassword === "string" ? body.currentPassword : "",
    password: typeof body.password === "string" ? body.password : "",
    confirmPassword: typeof body.confirmPassword === "string" ? body.confirmPassword : ""
  };
}

export function sanitizeProfileInput(body: Record<string, unknown>): ProfileInput {
  return {
    fullName: normalizeText(body.fullName),
    username: normalizeText(body.username).toLowerCase(),
    bio: normalizeText(body.bio),
    timeZone: normalizeText(body.timeZone) || "Asia/Kolkata"
  };
}

export function validateSignupInput(input: SignupInput): ValidationErrors<keyof SignupInput> {
  const errors: ValidationErrors<keyof SignupInput> = {};

  if (!input.fullName || input.fullName.length < 3) {
    errors.fullName = "Full name must be at least 3 characters.";
  }

  if (!usernameRegex.test(input.username)) {
    errors.username = "Username must be 4-30 characters and use only letters, numbers, or underscores.";
  }

  if (!emailRegex.test(input.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (input.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (!/[A-Z]/.test(input.password) || !/[0-9]/.test(input.password)) {
    errors.password = "Password must include at least one uppercase letter and one number.";
  }

  if (input.confirmPassword !== input.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (input.bio.length > 280) {
    errors.bio = "Bio must be 280 characters or less.";
  }

  if (!input.timeZone) {
    errors.timeZone = "Time zone is required.";
  }

  return errors;
}

export function validateSigninInput(input: SigninInput): ValidationErrors<keyof SigninInput> {
  const errors: ValidationErrors<keyof SigninInput> = {};

  if (!input.login) {
    errors.login = "Enter your email or username.";
  }

  if (!input.password) {
    errors.password = "Enter your password.";
  }

  return errors;
}

export function validateForgotPasswordInput(
  input: ForgotPasswordInput
): ValidationErrors<keyof ForgotPasswordInput> {
  const errors: ValidationErrors<keyof ForgotPasswordInput> = {};

  if (!emailRegex.test(input.email)) {
    errors.email = "Enter the email linked to your account.";
  }

  return errors;
}

export function validateVerifyOtpInput(input: VerifyOtpInput): ValidationErrors<keyof VerifyOtpInput> {
  const errors: ValidationErrors<keyof VerifyOtpInput> = {};

  if (!emailRegex.test(input.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!/^\d{6}$/.test(input.otp)) {
    errors.otp = "Enter the 6-digit OTP.";
  }

  return errors;
}

function validateNewPassword(input: {
  password: string;
  confirmPassword: string;
}): ValidationErrors<"password" | "confirmPassword"> {
  const errors: ValidationErrors<"password" | "confirmPassword"> = {};

  if (input.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (!/[A-Z]/.test(input.password) || !/[0-9]/.test(input.password)) {
    errors.password = "Password must include at least one uppercase letter and one number.";
  }

  if (input.confirmPassword !== input.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export function validateResetPasswordInput(
  input: ResetPasswordInput
): ValidationErrors<keyof ResetPasswordInput> {
  return {
    ...validateVerifyOtpInput(input),
    ...validateNewPassword(input)
  };
}

export function validateChangePasswordInput(
  input: ChangePasswordInput
): ValidationErrors<keyof ChangePasswordInput> {
  const errors: ValidationErrors<keyof ChangePasswordInput> = validateNewPassword(input);

  if (!input.currentPassword) {
    errors.currentPassword = "Enter your current password.";
  }

  return errors;
}

export function validateProfileInput(input: ProfileInput): ValidationErrors<keyof ProfileInput> {
  const errors: ValidationErrors<keyof ProfileInput> = {};

  if (!input.fullName || input.fullName.length < 3) {
    errors.fullName = "Full name must be at least 3 characters.";
  }

  if (!usernameRegex.test(input.username)) {
    errors.username = "Username must be 4-30 characters and use only letters, numbers, or underscores.";
  }

  if (input.bio.length > 280) {
    errors.bio = "Bio must be 280 characters or less.";
  }

  return errors;
}
