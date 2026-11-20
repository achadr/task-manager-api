// One-shot job for the LOCAL stack: creates the topic and the subscription the API needs
// on the Pub/Sub emulator, then exits. Measured on 2026-11-20: the emulator loses its topics
// and subscriptions every time its container restarts, so this runs before each backend start.
// In production, topics are created by the infrastructure, never by the application.
import { PubSub } from "@google-cloud/pubsub";
import logger from "../logging/Logger";

const TOPICS: Record<string, string[]> = {
  "task.created": ["notif"],
};

const MAX_ATTEMPTS = 15;
const DELAY_MS = 2000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function ensureResources(pubsub: PubSub): Promise<void> {
  for (const [topicName, subscriptions] of Object.entries(TOPICS)) {
    const topic = pubsub.topic(topicName);
    const [topicExists] = await topic.exists();
    if (!topicExists) await topic.create();
    logger.info("Topic ready", { topic: topicName, created: !topicExists });

    for (const subName of subscriptions) {
      const [subExists] = await pubsub.subscription(subName).exists();
      if (!subExists) await topic.createSubscription(subName);
      logger.info("Subscription ready", { subscription: subName, created: !subExists });
    }
  }
}

async function main(): Promise<void> {
  if (!process.env.PUBSUB_EMULATOR_HOST) {
    logger.error("PUBSUB_EMULATOR_HOST is not set: refusing to create resources on the real Pub/Sub");
    process.exit(1);
  }
  const pubsub = new PubSub({ projectId: process.env.PUBSUB_PROJECT_ID });

  // The emulator can take a few seconds to accept connections after its container starts.
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await ensureResources(pubsub);
      process.exit(0);
    } catch (error) {
      logger.warn("Pub/Sub emulator not ready, retrying", {
        attempt,
        error: error instanceof Error ? error.message : String(error),
      });
      await sleep(DELAY_MS);
    }
  }
  logger.error("Pub/Sub init failed after all attempts");
  process.exit(1);
}

main();
