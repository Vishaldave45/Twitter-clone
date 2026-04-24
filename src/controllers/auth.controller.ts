import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { env } from "../config/env";
import {
  createUser,
  emailExists,
  findUserById,
  usernameExists,
  verifyUserCredentials
} from "../services/auth.service";
import { SigninInput, SignupInput, ValidationErrors } from "../types/auth";
import { signAuthToken } from "../utils/jwt";
import {
  sanitizeSigninInput,
  sanitizeSignupInput,
  validateSigninInput,
  validateSignupInput
} from "../validators/auth.validator";
import { db } from "../config/db";
import { error } from "console";

function renderSignup(
  res: Response,
  payload: SignupInput,
  errors: ValidationErrors<keyof SignupInput>,
  formError = ""
): void {
  res.status(400).render("signup", {
    title: "Create your account",
    values: payload,
    errors,
    formError
  });
}

function renderSignin(
  res: Response,
  payload: SigninInput,
  errors: ValidationErrors<keyof SigninInput>,
  formError = ""
): void {
  res.status(400).render("signin", {
    title: "Sign in",
    values: payload,
    errors,
    formError
  });
}

function setAuthCookie(res: Response, token: string): void {
  res.cookie(env.cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

export function showLanding(_req: Request, res: Response): void {
  res.render("index", { title: "Twitter Clone" });
}

export function showSignup(_req: Request, res: Response): void {
  res.render("signup", {
    title: "Create your account",
    values: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      bio: ""
    },
    errors: {},
    formError: ""
  });
}

export async function signup(req: Request, res: Response): Promise<void> {
  const payload = sanitizeSignupInput(req.body as Record<string, unknown>);
  const errors = validateSignupInput(payload);

  if (Object.keys(errors).length > 0) {
    renderSignup(res, payload, errors);
    return;
  }

  if (await emailExists(payload.email)) {
    renderSignup(res, payload, { email: "That email is already in use." });
    return;
  }

  if (await usernameExists(payload.username)) {
    renderSignup(res, payload, { username: "That username is already taken." });
    return;
  }

  const avatarPath = req.file ? `/uploads/${req.file.filename}` : undefined;
  const user = await createUser(payload, avatarPath);
  const token = signAuthToken({
    userId: user.id,
    username: user.username,
    email: user.email
  });

  setAuthCookie(res, token);
  res.redirect("/home");
}

export function showSignin(req: Request, res: Response): void {
  res.render("signin", {
    title: "Sign in",
    values: {
      login: "",
      password: ""
    },
    errors: {},
    formError: typeof req.query.error === "string" ? req.query.error : ""
  });
}

export async function signin(req: Request, res: Response): Promise<void> {
  const payload = sanitizeSigninInput(req.body as Record<string, unknown>);
  const errors = validateSigninInput(payload);

  if (Object.keys(errors).length > 0) {
    renderSignin(res, payload, errors);
    return;
  }

  const user = await verifyUserCredentials(payload);

  if (!user) {
    renderSignin(res, payload, {}, "Invalid credentials.");
    return;
  }

  const token = signAuthToken({
    userId: user.id,
    username: user.username,
    email: user.email
  });

  setAuthCookie(res, token);
  res.redirect("/home");
}

export async function showHome(req: Request, res: Response): Promise<void> {
  const profile = req.user ? await findUserById(req.user.userId) : null;

  res.render("home", {
    title: "Home",
    user: req.user,
    profile
  });
}

export function logout(_req: Request, res: Response): void {
  res.clearCookie(env.cookieName);
  res.redirect("/signin?error=You have been signed out");
}

export const forgotPassword = async (_req: Request, res: Response): Promise<void> => {


  const { email } = _req.body as { email: string };
  console.log("Forgot password request for email:", email);

  const [user] :any = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  console.log(user);
  if (!user||user.length===0) {
    return  void res.send("USER_NOT_FOUND");
  }

  console.log(`User found for email ${email}:`, user[0]);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`Generated OTP for ${email}: ${otp}`);

  await db.query("update users set otp_code =?, otp_expiry = ? where email = ?", [otp, Date.now() + 2 * 60 * 1000, email]);


  // Here you would generate a password reset token and send an email to the user
  // For this example, we'll just log the action
  console.log(`Password reset requested for email: ${encodeURIComponent(email)}`);

  console.log("before redirect");
  res.redirect(`/email-simulation?email=${encodeURIComponent(email)}`)
}   

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body as { email: string; otp: string };
  console.log(`Verifying OTP for ${email}: ${otp}`);

  const [user]: any[] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

  if (user.length===0 || user[0].otp_code !== otp || user[0].otp_expiry < Date.now()) {
    return void res.render("email-simulation", {
      error: "Invalid or expired OTP. Please try again.",
      email
    });
  }
 return res.render("reset-password", { email });
}


export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, newPassword} = req.body as { email: string; newPassword: string };
  console.log(`Resetting password for ${email}`);

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db.query("update users set password_hash= ?, otp_code = null, otp_expiry = null where email = ?", [hashedPassword, email]);

  res.redirect("/signin");
}

export const resendOtp = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body as { email: string };
  console.log(`Resending OTP for ${email}`);

  const user = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  if (!user) {
    return void res.send("USER_NOT_FOUND");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`Generated OTP for ${email}: ${otp}`);

  await db.query("update users set otp_code =?, otp_expiry = ? where email = ?", [otp, Date.now() + 2 * 60 * 1000, email]);

  res.redirect(`/email-simulation?email=${email}`);
}

export const showEmailSimulation = async (req: Request, res: Response): Promise<void> => {
  const email =decodeURIComponent(req.query.email as string);
  
  const [user]: any[] = await db.query("SELECT otp_code FROM users WHERE email = ?", [email])  ;
  console.log(user);

 if(!user||user.length===0){
  return void res.render("forgot-password", {
    error: "No user found with that email address."
  } );  
 }  

 return void res.render("email-simulation", { email, otp: user[0].otp_code }) ;


} 