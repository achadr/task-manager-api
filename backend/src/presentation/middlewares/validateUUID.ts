import { Request, Response, NextFunction } from "express";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function validateUUID(paramName: string = "id") {
  return (req: Request, res: Response, next: NextFunction): void => {
    const value = req.params[paramName];

    if (!value) {
      res.status(400).json({
        error: "ValidationError",
        message: `Missing required parameter: ${paramName}`,
      });
      return;
    }

    if (!UUID_REGEX.test(value)) {
      res.status(400).json({
        error: "ValidationError",
        message: `Invalid UUID format for parameter: ${paramName}`,
      });
      return;
    }

    next();
  };
}
