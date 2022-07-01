import { Channel } from 'amqplib'

import { adaptConsumeMessage } from '../adapters'

import { makeSendWelcomeEmailController } from '../factories/controllers/welcome-email-controller-factory'

export default async (channel: Channel): Promise<void> => {
  /**
   * TODO: Implement Dead Letter Exchange
   */
  await channel.assertExchange('sign-up', 'direct', { durable: false })
  const { queue } = await channel.assertQueue('', { exclusive: true })
  await channel.bindQueue(queue, 'sign-up', 'welcome-email')
  await channel.consume(
    queue,
    adaptConsumeMessage(channel, makeSendWelcomeEmailController()),
    { noAck: false }
  )
}
