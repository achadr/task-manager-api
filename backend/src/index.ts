import { createApp } from "./app";
import logger from "./infrastructure/logging/Logger";
import { connectDatabase, disconnectDatabase } from "./infrastructure/database/connection";
import { validateEnv } from "./infrastructure/config/validateEnv";
import { Server } from "http";

// Validate environment variables first
const env = validateEnv();
const PORT = env.PORT;
let server: Server;

async function startServer(): Promise<void> {
  try {
    // Connect to database first
    await connectDatabase();

    // Create and start the app
    const app = createApp();
    server = app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server", {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
}

async function gracefulShutdown(signal: string): Promise<void> {
  logger.info(`${signal} received, starting graceful shutdown...`);

  if (server) {
    // Stop accepting new connections
    server.close(async (err) => {
      if (err) {
        logger.error("Error closing server", { error: err.message });
      } else {
        logger.info("Server closed successfully");
      }

      // Disconnect database
      await disconnectDatabase();

      // Exit process
      process.exit(err ? 1 : 0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10000);
  } else {
    await disconnectDatabase();
    process.exit(0);
  }
}

// Handle shutdown signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught errors
process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught exception", {
    error: error.message,
    stack: error.stack,
  });
  gracefulShutdown("UNCAUGHT_EXCEPTION");
});

process.on("unhandledRejection", (reason: unknown) => {
  logger.error("Unhandled rejection", {
    reason: reason instanceof Error ? reason.message : String(reason),
  });
  gracefulShutdown("UNHANDLED_REJECTION");
});

// Start the server
startServer();