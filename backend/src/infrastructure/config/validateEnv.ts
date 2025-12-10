import { z } from "zod";
import logger from "../logging/Logger";

const envSchema = z.object({
  // Server configuration
  PORT: z
    .string()
    .optional()
    .default("3000")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0 && val < 65536, {
      message: "PORT must be between 1 and 65535",
    }),

  // Node environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .optional()
    .default("development"),

  // Database configuration
  DATABASE_URL: z.string().optional(),

  // Logging
  LOG_LEVEL: z
    .enum(["error", "warn", "info", "debug"])
    .optional()
    .default("info"),

  // CORS configuration
  CORS_ORIGIN: z.string().optional().default("*"),

  // Rate limiting (optional overrides)
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 15 * 60 * 1000)),

  RATE_LIMIT_MAX_REQUESTS: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 100)),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(): EnvConfig {
  try {
    const validated = envSchema.parse(process.env);
    logger.info("Environment variables validated successfully", {
      nodeEnv: validated.NODE_ENV,
      port: validated.PORT,
      logLevel: validated.LOG_LEVEL,
    });
    return validated;
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error("Environment validation failed", {
        errors: error.issues.map((err: z.ZodIssue) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });
      throw new Error("Invalid environment configuration. Check logs for details.");
    }
    throw error;
  }
}
