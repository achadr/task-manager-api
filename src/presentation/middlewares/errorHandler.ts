import { Request, Response, NextFunction } from "express";
import { TaskNotFoundError } from "../../domain/errors/TaskNotFoundError";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(`[ERROR] ${error.message}`);

  if (error instanceof TaskNotFoundError) {
    res.status(404).json({
      error: error.name,
      message: error.message,
    });
    return;
  }

  // Default: Internal Server Error
  res.status(500).json({
    error: "InternalServerError",
    message: "Something went wrong",
  });
}