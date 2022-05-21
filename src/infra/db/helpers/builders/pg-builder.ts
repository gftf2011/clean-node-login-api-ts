/**
 * Driver
 */
import { Pool } from 'pg'

/**
 * Entities
 */
import { IDbClientBuilder } from '@/infra/contracts'

export class PgClientBuilder implements IDbClientBuilder {
  private product: Pool

  private host?: string

  private port?: number

  private user?: string

  private pass?: string

  private db?: string

  private max?: number

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

  public setDb (db: string): void {
    this.db = db
  }

  public setMax (max: string): void {
    this.max = +max
  }

  public build (): Pool {
    this.product = new Pool({
      host: this.host,
      port: this.port,
      user: this.user,
      password: this.pass,
      database: this.db,
      max: this.max
    })
    const result = this.product
    this.reset()
    return result
  }
}
