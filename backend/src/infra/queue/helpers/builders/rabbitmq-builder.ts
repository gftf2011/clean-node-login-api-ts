/**
 * Driver
 */
import { Connection, connect } from 'amqplib'

/**
 * Entities
 */
import { IQueueBuilder } from '@/infra/contracts'

export class RabbitmqQueueBuilder implements IQueueBuilder {
  private product: Connection

  private host?: string

  private port?: number

  private user?: string

  private pass?: string

  public constructor () {
    this.reset()
  }

  private reset (): void {
    this.product = undefined
  }

  public setHost (host: string): void {
    this.host = host
  }

  public setPort (port: string): void {
    this.port = +port
  }

  public setUser (user: string): void {
    this.user = user
  }

  public setPass (pass: string): void {
    this.pass = pass
  }

  public async build (): Promise<Connection> {
    this.product = await connect(`amqp://${this.user}:${this.pass}@${this.host}:${this.port}`)
    const result = this.product
    this.reset()
    return result
  }
}
