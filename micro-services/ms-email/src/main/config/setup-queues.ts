/* eslint-disable n/no-path-concat */
import { Channel, Connection } from 'amqplib'
import { readdirSync } from 'fs'

export default (connection: Connection): void => {
  readdirSync(`${__dirname}/../queues`).map(async (file) => {
    const channel: Channel = await connection.createChannel()
    return (await import(`${__dirname}/../queues/${file}`)).default(channel)
  })
}
