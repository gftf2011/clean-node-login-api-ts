/**
 * Drivers
 */
import { Pool } from 'pg'

/**
 * Infra
 */
import { DbClient, DbClientPool } from '../../contracts'
import { PgClientBuilder } from '../helpers/builders/pg-builder'
import { DbDirector } from '../helpers/builders/db-director'

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
    if (!PostgresDbClientPool.pool) {
      const builder = new PgClientBuilder()

      const director = new DbDirector()
      director.setBuilder(builder)

      PostgresDbClientPool.pool = director.getDbClient()
    }
  }

  static getInstance (): DbClientPool {
    if (!PostgresDbClientPool.instance) {
      PostgresDbClientPool.instance = new PostgresDbClientPool()
    }
    return PostgresDbClientPool.instance
  }

  public async getClient (): Promise<DbClient> {
    return await PostgresDbClientPool.pool.connect()
  }
}
