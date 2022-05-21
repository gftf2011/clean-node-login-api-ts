/**
 * Drivers
 */
import { Pool, PoolClient } from 'pg'

/**
 * Infrastructure | Contracts
 */
import { DbTransaction } from '@/infra/contracts'

/**
 * Infrastructure | Utils
 */
import { PgClientBuilder } from '@/infra/db/helpers/builders/pg-builder'

/**
 * Singleton class
 *
 * This class manages the global instance from a PostgresSQL Pool
 */
export class Postgres implements DbTransaction {
  private static pool: Pool
  private static instance: Postgres

  private constructor () {}

  public static connect (): Postgres {
    if (Postgres.instance === undefined || Postgres.instance === null) {
      const builder = new PgClientBuilder()

      builder.setDb(process.env.POSTGRES_DB)
      builder.setHost(process.env.POSTGRES_HOST)
      builder.setMax(process.env.POSTGRES_MAX)
      builder.setPass(process.env.POSTGRES_PASSWORD)
      builder.setPort(process.env.POSTGRES_PORT)
      builder.setUser(process.env.POSTGRES_USER)

      Postgres.pool = builder.build()
      Postgres.instance = new Postgres()
    }
    return Postgres.instance
  }

  public async client (): Promise<PoolClient> {
    const client = await Postgres.pool.connect()
    return client
  }

  public async openTransaction (client: PoolClient): Promise<void> {
    await client.query('BEGIN')
  }

  public async transaction (client: PoolClient, statement: string, values: any[]): Promise<any> {
    const result = await client.query(statement, values)
    return result
  }

  public async closeTransaction (client: PoolClient): Promise<void> {
    client.release()
  }

  public async commit (client: PoolClient): Promise<void> {
    await client.query('COMMIT')
  }

  public async rollback (client: PoolClient): Promise<void> {
    await client.query('ROLLBACK')
  }
}
