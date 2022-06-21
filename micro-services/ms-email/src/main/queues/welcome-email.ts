import { Channel } from 'amqplib'

import { adaptConsumeMessage } from '../adapters'

import { makeSendWelcomeEmailController } from '../factories/controllers/welcome-email-controller-factory'

export default async (channel: Channel): Promise<void> => {
  await channel.assertQueue('welcome-email', { durable: true })
  await channel.consume('welcome-email', adaptConsumeMessage(channel, makeSendWelcomeEmailController()), { noAck: false })
}
