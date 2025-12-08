import { Request, Response, NextFunction } from "express";
import { TaskNotFoundError } from "../../domain/errors/TaskNotFoundError";
import logger from "../../infrastructure/logging/Logger";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error("Request failed", {
    error: error.message,
    stack: error.stack,
    method: req.method,
    path: req.path,
  });

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