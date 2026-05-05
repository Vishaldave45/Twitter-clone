import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { env } from "../config/env";
import {
  createUser,
  emailExists,
  findUserByEmail,
  findUserByEmailOrUsername,
  findUserById,
  searchUsers,
  updatePassword,
  updateProfile,
  usernameExistsForAnotherUser,
  usernameExists,
  verifyPassword,
  verifyUserCredentials
} from "../services/auth.service";
<<<<<<< HEAD
import { getFeedTweets } from "../services/tweet.service";
import { SigninInput, SignupInput, ValidationErrors } from "../types/auth";
=======
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
>>>>>>> 8b20fd3 (`Added new features and functionality to the Twitter clone application`)
import { signAuthToken } from "../utils/jwt";
import {
  sanitizeChangePasswordInput,
  sanitizeForgotPasswordInput,
  sanitizeProfileInput,
  sanitizeResetPasswordInput,
  sanitizeSigninInput,
  sanitizeSignupInput,
  sanitizeVerifyOtpInput,
  validateChangePasswordInput,
  validateForgotPasswordInput,
  validateProfileInput,
  validateResetPasswordInput,
  validateSigninInput,
  validateSignupInput,
  validateVerifyOtpInput
} from "../validators/auth.validator";
<<<<<<< HEAD
import { db } from "../config/db";
=======
import {
  createPasswordResetOtp,
  markPasswordResetOtpUsed,
  verifyPasswordResetOtp
} from "../services/otp.service";
import {
  addComment,
  createTweet,
  deleteOwnTweet,
  getProfileStats,
  getTimeline,
  getUserTweets,
  toggleFollow,
  toggleLike,
  toggleRepost
} from "../services/social.service";
>>>>>>> 8b20fd3 (`Added new features and functionality to the Twitter clone application`)

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

function setAuthCookie(res: Response, token: string, rememberMe = false): void {
  res.cookie(env.cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000
  });
}

function routeParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
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
      bio: "",
<<<<<<< HEAD
      timeZone: ""
=======
      timeZone: "Asia/Kolkata"
>>>>>>> 8b20fd3 (`Added new features and functionality to the Twitter clone application`)
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

  const avatarPath = req.file ? req.file.filename : undefined;
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
      password: "",
      rememberMe: false
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

  setAuthCookie(res, token, payload.rememberMe);
  res.redirect("/home");
}

export async function showHome(req: Request, res: Response): Promise<void> {
  const profile = req.user ? await findUserById(req.user.userId) : null;
<<<<<<< HEAD
  const tweets = await getFeedTweets();
=======
  const tweets = req.user ? await getTimeline(req.user.userId) : [];
>>>>>>> 8b20fd3 (`Added new features and functionality to the Twitter clone application`)

  res.render("home", {
    title: "Home",
    user: req.user,
    profile,
<<<<<<< HEAD
    tweets
=======
    tweets,
    message: typeof req.query.message === "string" ? req.query.message : ""
>>>>>>> 8b20fd3 (`Added new features and functionality to the Twitter clone application`)
  });
}

export function logout(_req: Request, res: Response): void {
  res.clearCookie(env.cookieName);
  res.redirect("/signin?error=You have been signed out");
}

<<<<<<< HEAD
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
=======
export function showForgotPassword(req: Request, res: Response): void {
  res.render("forgot-password", {
    title: "Forgot password",
    values: { email: typeof req.query.email === "string" ? req.query.email : "" },
    errors: {},
    formError: ""
  });
}

function renderForgotPassword(
  res: Response,
  payload: ForgotPasswordInput,
  errors: ValidationErrors<keyof ForgotPasswordInput>,
  formError = ""
): void {
  res.status(400).render("forgot-password", {
    title: "Forgot password",
    values: payload,
    errors,
    formError
  });
}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  const payload = sanitizeForgotPasswordInput(req.body as Record<string, unknown>);
  const errors = validateForgotPasswordInput(payload);

  if (Object.keys(errors).length > 0) {
    renderForgotPassword(res, payload, errors);
    return;
  }

  const user = await findUserByEmail(payload.email);

  if (!user) {
    renderForgotPassword(res, payload, {}, "No account exists for that email.");
    return;
  }

  const issue = await createPasswordResetOtp(user.id);
  res.render("email-simulation", {
    title: "Your Email Inbox (Simulation)",
    email: user.email,
    fullName: user.full_name,
    otp: issue.otp,
    expiresAt: issue.expiresAt.toISOString()
  });
}

export function showVerifyOtp(req: Request, res: Response): void {
  res.render("verify-otp", {
    title: "Verify OTP",
    values: { email: typeof req.query.email === "string" ? req.query.email : "", otp: "" },
    errors: {},
    formError: ""
  });
}

function renderVerifyOtp(
  res: Response,
  payload: VerifyOtpInput,
  errors: ValidationErrors<keyof VerifyOtpInput>,
  formError = ""
): void {
  res.status(400).render("verify-otp", {
    title: "Verify OTP",
    values: payload,
    errors,
    formError
  });
}

export async function verifyOtp(req: Request, res: Response): Promise<void> {
  const payload = sanitizeVerifyOtpInput(req.body as Record<string, unknown>);
  const errors = validateVerifyOtpInput(payload);

  if (Object.keys(errors).length > 0) {
    renderVerifyOtp(res, payload, errors);
    return;
  }

  const user = await findUserByEmail(payload.email);
  const otpRecord = user ? await verifyPasswordResetOtp(user.id, payload.otp) : null;

  if (!user || !otpRecord) {
    renderVerifyOtp(res, payload, {}, "OTP is invalid or expired.");
    return;
  }

  res.render("reset-password", {
    title: "Reset password",
    values: { email: payload.email, otp: payload.otp, password: "", confirmPassword: "" },
    errors: {},
    formError: ""
  });
}

function renderResetPassword(
  res: Response,
  payload: ResetPasswordInput,
  errors: ValidationErrors<keyof ResetPasswordInput>,
  formError = ""
): void {
  res.status(400).render("reset-password", {
    title: "Reset password",
    values: payload,
    errors,
    formError
  });
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  const payload = sanitizeResetPasswordInput(req.body as Record<string, unknown>);
  const errors = validateResetPasswordInput(payload);

  if (Object.keys(errors).length > 0) {
    renderResetPassword(res, payload, errors);
    return;
  }

  const user = await findUserByEmail(payload.email);
  const otpRecord = user ? await verifyPasswordResetOtp(user.id, payload.otp) : null;

  if (!user || !otpRecord) {
    renderResetPassword(res, payload, {}, "OTP is invalid or expired.");
    return;
  }

  await updatePassword(user.id, payload.password);
  await markPasswordResetOtpUsed(otpRecord.id);
  res.redirect("/signin?error=Password reset successful. Please sign in.");
}

export async function resendOtp(req: Request, res: Response): Promise<void> {
  const email = typeof req.body.email === "string" ? req.body.email.toLowerCase().trim() : "";
  const user = await findUserByEmail(email);

  if (!user) {
    res.redirect("/forgot-password");
    return;
  }

  const issue = await createPasswordResetOtp(user.id);
  res.render("email-simulation", {
    title: "Your Email Inbox (Simulation)",
    email: user.email,
    fullName: user.full_name,
    otp: issue.otp,
    expiresAt: issue.expiresAt.toISOString()
  });
}

export async function createTweetPost(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.redirect("/signin");
    return;
  }

  const content = typeof req.body.content === "string" ? req.body.content.trim() : "";
  const image = req.file ? `/uploads/${req.file.filename}` : undefined;

  if (content.length > 0 && content.length <= 280) {
    await createTweet(req.user.userId, content, image);
  }

  res.redirect("/home");
}

export async function deleteTweetPost(req: Request, res: Response): Promise<void> {
  if (req.user) {
    await deleteOwnTweet(req.user.userId, Number(req.params.id));
  }

  res.redirect("/home");
}

export async function likeTweet(req: Request, res: Response): Promise<void> {
  if (req.user) {
    await toggleLike(req.user.userId, Number(req.params.id));
  }

  res.redirect(req.get("Referrer") ?? "/home");
}

export async function repostTweet(req: Request, res: Response): Promise<void> {
  if (req.user) {
    await toggleRepost(req.user.userId, Number(req.params.id));
  }

  res.redirect(req.get("Referrer") ?? "/home");
}

export async function commentTweet(req: Request, res: Response): Promise<void> {
  if (req.user) {
    const content = typeof req.body.content === "string" ? req.body.content.trim() : "";
    if (content.length > 0 && content.length <= 280) {
      await addComment(req.user.userId, Number(req.params.id), content);
    }
  }

  res.redirect(req.get("Referrer") ?? "/home");
}

export async function showProfile(req: Request, res: Response): Promise<void> {
  const currentUserId = req.user?.userId ?? 0;
  const username = routeParam(req.params.username).toLowerCase();
  const profile = await findUserByEmailOrUsername(username);

  if (!profile) {
    res.status(404).render("error", { title: "Profile not found", message: "That profile does not exist." });
    return;
  }

  const [tweets, stats] = await Promise.all([
    getUserTweets(profile.id, currentUserId),
    getProfileStats(profile.id, currentUserId)
  ]);

  res.render("profile", {
    title: `@${profile.username}`,
    profile,
    tweets,
    stats,
    isOwnProfile: currentUserId === profile.id
  });
}

export async function showEditProfile(req: Request, res: Response): Promise<void> {
  const profile = req.user ? await findUserById(req.user.userId) : null;

  if (!profile) {
    res.redirect("/signin");
    return;
  }

  res.render("edit-profile", {
    title: "Edit profile",
    values: {
      fullName: profile.full_name,
      username: profile.username,
      bio: profile.bio ?? "",
      timeZone: profile.time_zone
    },
    errors: {},
    formError: ""
  });
}

function renderEditProfile(
  res: Response,
  payload: ProfileInput,
  errors: ValidationErrors<keyof ProfileInput>,
  formError = ""
): void {
  res.status(400).render("edit-profile", {
    title: "Edit profile",
    values: payload,
    errors,
    formError
  });
}

export async function editProfile(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.redirect("/signin");
    return;
  }

  const payload = sanitizeProfileInput(req.body as Record<string, unknown>);
  const errors = validateProfileInput(payload);

  if (Object.keys(errors).length > 0) {
    renderEditProfile(res, payload, errors);
    return;
  }

  if (await usernameExistsForAnotherUser(payload.username, req.user.userId)) {
    renderEditProfile(res, payload, { username: "That username is already taken." });
    return;
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  const avatar = files?.avatar?.[0] ? `/uploads/${files.avatar[0].filename}` : undefined;
  const cover = files?.cover?.[0] ? `/uploads/${files.cover[0].filename}` : undefined;
  await updateProfile(req.user.userId, payload, avatar, cover);
  res.redirect(`/profile/${payload.username}`);
}

export async function followProfile(req: Request, res: Response): Promise<void> {
  const currentUserId = req.user?.userId;
  const username = routeParam(req.params.username).toLowerCase();
  const profile = await findUserByEmailOrUsername(username);

  if (currentUserId && profile) {
    await toggleFollow(currentUserId, profile.id);
  }

  res.redirect(`/profile/${username}`);
}

export async function showChangePassword(req: Request, res: Response): Promise<void> {
  res.render("change-password", {
    title: "Change password",
    values: { currentPassword: "", password: "", confirmPassword: "" },
    errors: {},
    formError: ""
  });
}

function renderChangePassword(
  res: Response,
  payload: ChangePasswordInput,
  errors: ValidationErrors<keyof ChangePasswordInput>,
  formError = ""
): void {
  res.status(400).render("change-password", {
    title: "Change password",
    values: payload,
    errors,
    formError
  });
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.redirect("/signin");
    return;
  }

  const payload = sanitizeChangePasswordInput(req.body as Record<string, unknown>);
  const errors = validateChangePasswordInput(payload);

  if (Object.keys(errors).length > 0) {
    renderChangePassword(res, payload, errors);
    return;
  }

  if (!(await verifyPassword(req.user.userId, payload.currentPassword))) {
    renderChangePassword(res, payload, {}, "Current password is incorrect.");
    return;
  }

  await updatePassword(req.user.userId, payload.password);
  res.redirect("/home?message=Password changed successfully");
}

export async function search(req: Request, res: Response): Promise<void> {
  const query = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const users = req.user ? await searchUsers(query, req.user.userId) : [];

  res.render("search", {
    title: "Search",
    query,
    users
  });
}
>>>>>>> 8b20fd3 (`Added new features and functionality to the Twitter clone application`)
