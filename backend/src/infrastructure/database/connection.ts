import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";
import logger from "../logging/Logger";

const dbPath = path.resolve(__dirname, "../../../data/tasks.sqlite");

const adapter = new PrismaLibSql({
  url: `file:${dbPath}`,
});

const prisma = new PrismaClient({
  adapter,
  log: [
    { level: "error", emit: "event" },
    { level: "warn", emit: "event" },
  ],
});

// Log Prisma errors
prisma.$on("error", (e) => {
  logger.error("Prisma error", { message: e.message, target: e.target });
});

prisma.$on("warn", (e) => {
  logger.warn("Prisma warning", { message: e.message, target: e.target });
});

// Test connection on startup
export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info("Database connected successfully", { path: dbPath });
  } catch (error) {
    logger.error("Failed to connect to database", {
      error: error instanceof Error ? error.message : String(error),
      path: dbPath,
    });
    throw new Error("Database connection failed");
  }
}

// Graceful disconnect
export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    logger.info("Database disconnected successfully");
  } catch (error) {
    logger.error("Error disconnecting from database", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export default prisma;