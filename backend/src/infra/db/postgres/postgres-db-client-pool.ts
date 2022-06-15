/**
 * Drivers
 */
import { Pool } from 'pg'

/**
 * Infra
 */
import { DbClient, DbClientPool } from '../../contracts'
import { PgClientBuilder } from '../helpers/builders/pg-builder'

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Garantees that only one instance from the object will exists in project
 * It uses the {@link https://refactoring.guru/pt-br/design-patterns/singleton Singleton} design pattern
 */
export class PostgresDbClientPool implements DbClientPool {
  private static pool: Pool
  private static instance: PostgresDbClientPool

  private constructor () {}

  static connect (): void {
    if (!PostgresDbClientPool.pool || !PostgresDbClientPool.instance) {
      const builder = new PgClientBuilder()

      builder.setDb(process.env.POSTGRES_DB)
      builder.setHost(process.env.POSTGRES_HOST)
      builder.setMax(process.env.POSTGRES_MAX)
      builder.setPass(process.env.POSTGRES_PASSWORD)
      builder.setPort(process.env.POSTGRES_PORT)
      builder.setUser(process.env.POSTGRES_USER)

      PostgresDbClientPool.pool = builder.build()
      PostgresDbClientPool.instance = new PostgresDbClientPool()
    }
  }

  static getInstance (): DbClientPool {
    return PostgresDbClientPool.instance
  }

  public async getClient (): Promise<DbClient> {
    return await PostgresDbClientPool.pool.connect()
  }
}
