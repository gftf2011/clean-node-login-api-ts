import { Controller, Request } from '../../presentation/ports'

import { ConsumeMessage } from 'amqplib'

export const adaptConsumeMessage = (controller: Controller) => {
  return async (msg: ConsumeMessage | null) => {
    const request: Request = {
      content: {}
    }

    if (msg !== null) {
      request.content = JSON.parse(msg.content.toString())
    }

    await controller.handle(request)
  }
}
