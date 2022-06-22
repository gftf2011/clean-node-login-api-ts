/**
 * Infra
 */
import { QueueConnection } from '../../contracts'

/**
 * Use Cases
 */
import { QueuePublishManager } from '../../../use-cases/ports/queue-publish-manager'

export class RabbitmqQueuePublishManager implements QueuePublishManager {
  constructor (private readonly queueConnection: QueueConnection) {}

  async publish (exchange: string, bindingKey: string, content: string): Promise<void> {
    await this.queueConnection.getChannel().send(exchange, bindingKey, Buffer.from(content))
  }

  async close (): Promise<void> {
    await this.queueConnection.getChannel().closeAll()
  }
}
