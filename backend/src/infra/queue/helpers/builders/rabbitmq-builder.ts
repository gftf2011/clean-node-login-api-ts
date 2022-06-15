/**
 * Driver
 */
import { Connection, connect, Options } from 'amqplib'

/**
 * Entities
 */
import { IQueueBuilder } from '../../../contracts'

export class RabbitmqQueueBuilder implements IQueueBuilder {
  private product: Options.Connect

  public constructor () {
    this.reset()
  }

  private reset (): void {
    this.product = {}
  }

  public setHost (host: string): void {
    this.product.hostname = host
  }

  public setPort (port: string): void {
    this.product.port = +port
  }

  public setUser (user: string): void {
    this.product.username = user
  }

  public setPass (pass: string): void {
    this.product.password = pass
  }

  public async build (): Promise<Connection> {
    const result = await connect(this.product)
    this.reset()
    return result
  }
}
