/**
 * Driver
 */
import redis from 'redis'

/**
 * Infra
 */
import { IDbClientBuilder } from '@/infra/contracts'

export class RedisClientBuilder implements IDbClientBuilder {
  private host?: string

  private port?: number

  private pass?: string

  private db?: string

  public setHost (): void {
    this.host = process.env.REDIS_HOST
  }

  public setPort (): void {
    const entryPort = process.env.REDIS_PORT
    this.port = entryPort ? +entryPort : 6379
  }

  public setUser (): void {}

  public setPass (): void {
    this.pass = process.env.REDIS_PASSWORD
  }

  public setDb (): void {
    this.db = process.env.REDIS_DB_NUMBER
  }

  public setMax (): void {}

  public build (): any {
    const result = redis.createClient({
      password: this.pass,
      db: this.db,
      host: this.host,
      port: this.port,
      enable_offline_queue: false
    })
    return result
  }
}
