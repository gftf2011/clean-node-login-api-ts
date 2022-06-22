/**
 * Driver
 */
import { Connection, Options, connect } from 'amqplib'

/**
 * Entities
 */
import { IQueueBuilder } from '../../../contracts'

export class RabbitmqQueueBuilder implements IQueueBuilder {
  private product: Options.Connect

  public constructor() {
    this.reset()
  }

  private reset(): void {
    this.product = {}
  }

  public setHost(): void {
    this.product.hostname = process.env.RABBITMQ_HOST
  }

  public setPort(): void {
    this.product.port = +process.env.RABBITMQ_PORT
  }

  public setUser(): void {
    this.product.username = process.env.RABBITMQ_USER
  }

  public setPass(): void {
    this.product.password = process.env.RABBITMQ_PASSWORD
  }

  public async build(): Promise<Connection> {
    const result = await connect(this.product)
    this.reset()
    return result
  }
}
