import { Connection, connect } from 'amqplib'
import setupQueues from '../config/setup-queues'

const app = async () => {
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
  setupQueues(connection)
}

export default app
