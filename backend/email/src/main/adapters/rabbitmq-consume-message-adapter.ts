/**
 * Driver
 */
import { Channel, ConsumeMessage } from 'amqplib'

/**
 * Presentation
 */
import { Controller, Request } from '../../presentation/ports'

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Rabbit MQ message consumer adapter
 * It uses the {@link https://refactoring.guru/pt-br/design-patterns/adapter Adapter} design pattern
 */
export const adaptConsumeMessage = (
  channel: Channel,
  controller: Controller
) => {
  return async (msg: ConsumeMessage | null): Promise<void> => {
    const request: Request = {
      content: {},
    }

    if (msg !== null) {
      request.content = JSON.parse(msg.content.toString())
    }
    /**
     * Command below used to tell RabbitMQ to not dispatch new messages to work queues
     * until de previous one is acknowledge
     */
    await channel.prefetch(1)
    await controller.handle(request)
    channel.ack(msg, false)
  }
}
