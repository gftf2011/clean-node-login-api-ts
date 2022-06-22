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

  public constructor() {
    this.reset()
  }

  private reset(): void {
    this.product = {}
  }

  public setHost(): void {
    this.product.host = process.env.POSTGRES_HOST
  }

  public setPort(): void {
    this.product.port = +process.env.POSTGRES_PORT
  }

  public setUser(): void {
    this.product.user = process.env.POSTGRES_USER
  }

  public setPass(): void {
    this.product.password = process.env.POSTGRES_PASSWORD
  }

  public setDb(): void {
    this.product.database = process.env.POSTGRES_DB
  }

  public setMax(): void {
    this.product.max = +process.env.POSTGRES_MAX
  }

  public build(): Pool {
    const result = new Pool(this.product)
    this.reset()
    return result
  }
}
