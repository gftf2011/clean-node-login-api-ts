import { Channel, Connection, ConsumeMessage, connect } from 'amqplib'

export const app = async () => {
  let connection: Connection

  /**
   * Retry connection logic, queue connection is not immediate
   */
  while (!connection) {
    try {
      connection = await connect(process.env.RABBITMQ_CONNECTION_URL)
    } catch (err) {
      connection = null
    }
  }

  const channel: Channel = await connection.createChannel()

  await channel.assertQueue('send-email-to-complete-sign-in', { durable: true })
  await channel.consume('send-email-to-complete-sign-in', (msg: ConsumeMessage | null) => {
    console.log(JSON.parse(msg.content.toString()))
  }, { noAck: false })
}
