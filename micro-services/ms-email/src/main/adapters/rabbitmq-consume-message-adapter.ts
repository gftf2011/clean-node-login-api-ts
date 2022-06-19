import { Channel, ConsumeMessage } from 'amqplib'

import { Controller, Request } from '../../presentation/ports'

export const adaptConsumeMessage = (channel: Channel, controller: Controller) => {
  return async (msg: ConsumeMessage | null): Promise<void> => {
    const request: Request = {
      content: {}
    }

    if (msg !== null) {
      request.content = JSON.parse(msg.content.toString())
    }

    const response = await controller.handle(request)
    if (response instanceof Error) {
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
