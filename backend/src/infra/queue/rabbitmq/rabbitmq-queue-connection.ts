import { Channel, Connection } from 'amqplib'

/**
 * Infra
 */
import { QueueChannel, QueueConnection } from '../../contracts'
import { QueueDirector } from '../helpers/builders/queue-director'
import { RabbitmqQueueBuilder } from '../helpers/builders/rabbitmq-builder'

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Garantees that only one instance from the object will exists in project
 * It uses the {@link https://refactoring.guru/pt-br/design-patterns/singleton Singleton} design pattern
 */
export class RabbitmqQueueConnection implements QueueConnection {
  private static instance: RabbitmqQueueConnection
  private static channel: QueueChannel

  private constructor () {}

  static async connect (): Promise<void> {
    if (!RabbitmqQueueConnection.instance || !RabbitmqQueueConnection.channel) {
      const builder = new RabbitmqQueueBuilder()

      const director = new QueueDirector()

      director.setBuilder(builder)

      let connection: Connection

      /**
       * Retry connection logic, queue connection is not immediate
       */
      while (!connection) {
        try {
          connection = await director.getQueueConnection()
        } catch (err) {
          connection = null
        }
      }

      const channel: Channel = await connection.createChannel()

      RabbitmqQueueConnection.channel = {
        send: async (queue: string, content: Buffer) => {
          await channel.assertQueue(queue, { durable: true })
          channel.sendToQueue(queue, content)
        }
      }
    }
  }

  public static getInstance (): RabbitmqQueueConnection {
    if (!RabbitmqQueueConnection.instance) {
      RabbitmqQueueConnection.instance = new RabbitmqQueueConnection()
    }
    return RabbitmqQueueConnection.instance
  }

  public getChannel (): QueueChannel {
    return RabbitmqQueueConnection.channel
  }
}
