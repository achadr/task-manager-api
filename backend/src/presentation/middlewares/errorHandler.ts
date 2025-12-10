import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { TaskNotFoundError } from "../../domain/errors/TaskNotFoundError";
import logger from "../../infrastructure/logging/Logger";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error("Request failed", {
    requestId: req.requestId,
    error: error.message,
    stack: error.stack,
    method: req.method,
    path: req.path,
  });

  // Handle domain errors
  if (error instanceof TaskNotFoundError) {
    res.status(404).json({
      error: error.name,
      message: error.message,
    });
    return;
  }

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (error.code === "P2002") {
      res.status(409).json({
        error: "ConflictError",
        message: "A resource with this value already exists",
        details: error.meta,
      });
      return;
    }

    // Record not found
    if (error.code === "P2025") {
      res.status(404).json({
        error: "NotFoundError",
        message: "The requested resource was not found",
      });
      return;
    }

    // Foreign key constraint violation
    if (error.code === "P2003") {
      res.status(400).json({
        error: "BadRequestError",
        message: "Invalid reference to related resource",
      });
      return;
    }

    // Invalid data provided
    if (error.code === "P2006" || error.code === "P2007") {
      res.status(400).json({
        error: "ValidationError",
        message: "Invalid data provided",
      });
      return;
    }
  }

  // Handle Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      error: "ValidationError",
      message: "Invalid data format or missing required fields",
    });
    return;
  }

  // Handle Prisma initialization errors
  if (error instanceof Prisma.PrismaClientInitializationError) {
    res.status(503).json({
      error: "ServiceUnavailableError",
      message: "Database connection failed",
    });
    return;
  }

  // Handle domain validation errors (from Task entity methods)
  if (error.message === "Task is already completed") {
    res.status(400).json({
      error: "ValidationError",
      message: error.message,
    });
    return;
  }

  // Default: Internal Server Error
  res.status(500).json({
    error: "InternalServerError",
    message: "An unexpected error occurred",
  });
}