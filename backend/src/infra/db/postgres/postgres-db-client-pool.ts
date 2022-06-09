/**
 * Drivers
 */
import { Pool } from 'pg'

/**
 * Infrastructure
 */
import { DbClient, DbClientPool } from '@/infra/contracts'
import { PgClientBuilder } from '@/infra/db/helpers/builders/pg-builder'

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
