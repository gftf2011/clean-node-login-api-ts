import { Channel } from 'amqplib'

/**
 * Infra
 */
import { QueueChannel, QueueConnection } from '@/infra/contracts'
import { RabbitmqQueueBuilder } from '@/infra/queue/helpers/builders/rabbitmq-builder'

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Garantees that only one instance from the object will exists in project
 * It uses the {@link https://refactoring.guru/pt-br/design-patterns/singleton Singleton} design pattern
 */
export class RabbitmqQueueConnection implements QueueConnection {
  private static instance: RabbitmqQueueConnection
  private static channel: QueueChannel

  private constructor() {}

  static async connect(): Promise<void> {
    if (!RabbitmqQueueConnection.instance || !RabbitmqQueueConnection.channel) {
      const builder = new RabbitmqQueueBuilder()

      builder.setHost(process.env.RABBITMQ_HOST)
      builder.setPass(process.env.RABBITMQ_PASSWORD)
      builder.setPort(process.env.RABBITMQ_PORT)
      builder.setUser(process.env.RABBITMQ_USER)

      const connection = await builder.build()

      const channel: Channel = await connection.createChannel()

      RabbitmqQueueConnection.channel = {
        send: (queue: string, content: Buffer) => {
          channel.sendToQueue(queue, content)
        }
      }

      RabbitmqQueueConnection.instance = new RabbitmqQueueConnection()
    }
  }

  public static getInstance (): RabbitmqQueueConnection {
    return RabbitmqQueueConnection.instance
  }

  public getChannel (): QueueChannel {
    return RabbitmqQueueConnection.channel
  }
}
