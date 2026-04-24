import { SigninInput, SignupInput, ValidationErrors } from "../types/auth";

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
    bio: normalizeText(body.bio)
  };
}

export function sanitizeSigninInput(body: Record<string, unknown>): SigninInput {
  return {
    login: normalizeText(body.login).toLowerCase(),
    password: typeof body.password === "string" ? body.password : ""
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
