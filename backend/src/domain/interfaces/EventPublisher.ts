// Publishes domain events (e.g. "task.created") to whatever messaging system is wired in.
// Contract: publish() never throws. A failed publication is logged by the implementation
// and the caller carries on (decision of 2026-11-20: the task is created, the event may be lost).
export interface EventPublisher {
  publish(eventName: string, payload: Record<string, unknown>): Promise<void>;
}
