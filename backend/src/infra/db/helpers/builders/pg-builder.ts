/**
 * Driver
 */
import { Pool, PoolConfig } from 'pg'

/**
 * Infra
 */
import { IDbClientBuilder } from '../../../contracts'

export class PgClientBuilder implements IDbClientBuilder {
  private product: PoolConfig

  public constructor () {
    this.reset()
  }

  private reset (): void {
    this.product = {}
  }

  public setHost (host: string): void {
    this.product.host = host
  }

  public setPort (port: string): void {
    this.product.port = +port
  }

  public setUser (user: string): void {
    this.product.user = user
  }

  public setPass (pass: string): void {
    this.product.password = pass
  }

  public setDb (db: string): void {
    this.product.database = db
  }

  public setMax (max: string): void {
    this.product.max = +max
  }

  public build (): Pool {
    const result = new Pool(this.product)
    this.reset()
    return result
  }
}
