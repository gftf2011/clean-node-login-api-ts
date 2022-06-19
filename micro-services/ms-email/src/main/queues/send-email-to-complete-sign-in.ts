import { Channel } from 'amqplib'

import { adaptConsumeMessage } from '../adapters'

import { makeSendEmailToCompleteSignInController } from '../factories/controllers/send-email-to-complete-sign-in-controller-factory'

export default async (channel: Channel): Promise<void> => {
  await channel.assertQueue('send-email-to-complete-sign-in', { durable: true })
  await channel.consume('send-email-to-complete-sign-in', adaptConsumeMessage(channel, makeSendEmailToCompleteSignInController()), { noAck: false })
}
