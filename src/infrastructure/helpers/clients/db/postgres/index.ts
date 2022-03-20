/**
 * Drivers
 */
import { Pool, PoolClient } from 'pg'

/**
 * Domain | Data
 */
import { DbTransaction } from '@/data/protocols/db/client'

/**
 * Infrastructure | Utils
 */
import { DbDirector } from '@/infrastructure/helpers/clients/builders/db-director'
import { PgClientBuilder } from '@/infrastructure/helpers/clients/builders/pg-builder'

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
      const director = new DbDirector()

      director.setBuilder(builder)

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

  public closeTransaction (client: PoolClient): void {
    client.release()
  }

  public async commit (client: PoolClient): Promise<void> {
    await client.query('COMMIT')
  }

  public async rollback (client: PoolClient): Promise<void> {
    await client.query('ROLLBACK')
  }
}
