import { Channel, ConsumeMessage } from 'amqplib'

export default async (channel: Channel): Promise<void> => {
  await channel.assertQueue('send-email-to-complete-sign-in', { durable: true })
  await channel.consume('send-email-to-complete-sign-in', (msg: ConsumeMessage | null) => {
    console.log(JSON.parse(msg.content.toString()))
  }, { noAck: false })
}
