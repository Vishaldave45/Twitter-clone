import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { verifyAuthToken } from "../utils/jwt";

export function attachCurrentUser(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.[env.cookieName];

  if (token) {
    try {
      req.user = verifyAuthToken(token);
    } catch {
      res.clearCookie(env.cookieName);
    }
  }

  res.locals.currentUser = req.user;
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.redirect("/signin?error=Please sign in to continue");
    return;
  }

  next();
}

export function redirectIfAuthenticated(req: Request, res: Response, next: NextFunction): void {
  if (req.user) {
    res.redirect("/home");
    return;
  }

  next();
}
