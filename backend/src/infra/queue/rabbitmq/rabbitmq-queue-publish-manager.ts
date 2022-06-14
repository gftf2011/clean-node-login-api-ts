/**
 * Infra
 */
import { QueueConnection } from "@/infra/contracts";

/**
 * Use Cases
 */
import { QueuePublishManager } from "@/use-cases/ports/queue-publish-manager";

export class RabbitmqQueuePublishManager implements QueuePublishManager {

  constructor (private readonly queueConnection: QueueConnection) {}

  async publish(queue: string, content: string): Promise<void> {
    this.queueConnection.getChannel().send(queue, Buffer.from(content))
  }
}