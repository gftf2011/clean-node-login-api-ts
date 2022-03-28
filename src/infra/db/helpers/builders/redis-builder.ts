/**
 * Driver
 */
import redis from 'redis'

/**
 * Entities
 */
import { IDbClientBuilder } from '@/infra/contracts'

export class RedisClientBuilder implements IDbClientBuilder {
  private host?: string

  private port?: number

  private user?: string

  private pass?: string

  private db?: string

  public setHost (): void {
    this.host = process.env.REDIS_HOST
  }

  public setPort (): void {
    const entryPort = process.env.REDIS_PORT
    this.port = entryPort ? +entryPort : 6379
  }

  public setUser (): void {
    this.user = process.env.REDIS_USER
  }

  public setPass (): void {
    this.pass = process.env.REDIS_PASSWORD
  }

  public setDb (): void {
    this.db = process.env.REDIS_DB_NUMBER
  }

  public setMax (): void {}

  public build (): any {
    const result = redis.createClient({
      url: `redis://${this.user}:${this.pass}@${this.host}:${this.port}/${this.db}`,
      enable_offline_queue: false
    })
    return result
  }
}
