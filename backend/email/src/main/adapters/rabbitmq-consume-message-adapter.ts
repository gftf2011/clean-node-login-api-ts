/**
 * Driver
 */
import { Channel, ConsumeMessage } from 'amqplib'

/**
 * Presentation
 */
import { Controller, Request } from '../../presentation/ports'

/**
 * Shared
 */
import { Error500 } from '../../shared/errors'

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

    const response = await controller.handle(request)
    if (response instanceof Error500) {
      channel.nack(msg, false, true)
      return
    }
    if (response) {
      channel.ack(msg, false)
      return
    }
    channel.nack(msg, false, false)
  }
}
