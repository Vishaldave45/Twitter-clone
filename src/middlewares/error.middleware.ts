import { NextFunction, Request, Response } from "express";

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(error);
  res.status(500).render("error", {
    title: "Something went wrong",
    message: "The app hit an unexpected error. Please try again."
  });
}
