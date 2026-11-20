import { PubSub } from "@google-cloud/pubsub";
import { EventPublisher } from "../../domain/interfaces/EventPublisher";
import logger from "../logging/Logger";

// One Pub/Sub topic per event: the topic name is the event name (e.g. "task.created").
// The topic itself is created outside the API (pubsub-init locally, infrastructure in production).
export class PubSubEventPublisher implements EventPublisher {
  constructor(private pubsub: PubSub) {}

  async publish(eventName: string, payload: Record<string, unknown>): Promise<void> {
    try {
      const messageId = await this.pubsub
        .topic(eventName)
        .publishMessage({ data: Buffer.from(JSON.stringify(payload)) });
      logger.info("Event published", { event: eventName, messageId });
    } catch (error) {
      // Strategy chosen on 2026-11-20: log at ERROR level and do not fail the request.
      // The message is lost; an alert on these log lines is how the team finds out.
      logger.error("Event publication failed", {
        event: eventName,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
