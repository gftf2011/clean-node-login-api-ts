/**
 * Infra
 */
import { Pool } from 'pg';
// eslint-disable-next-line sort-imports
import { DbClient, DbClientPool } from '../../contracts';
import { DbDirector } from '../helpers/builders/db-director';
import { PgClientBuilder } from '../helpers/builders/pg-builder';

/**
 * Drivers
 */

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Garantees that only one instance from the object will exists in project
 * It uses the {@link https://refactoring.guru/pt-br/design-patterns/singleton Singleton} design pattern
 */
export class PostgresDbClientPool implements DbClientPool {
  private static pool: Pool;

  private static instance: PostgresDbClientPool;

  private constructor() {}

  static connect(): void {
    if (!PostgresDbClientPool.pool) {
      const builder = new PgClientBuilder();

      const director = new DbDirector();
      director.setBuilder(builder);

      PostgresDbClientPool.pool = director.getDbClient();
    }
  }

  static getInstance(): DbClientPool {
    if (!PostgresDbClientPool.instance) {
      PostgresDbClientPool.instance = new PostgresDbClientPool();
    }
    return PostgresDbClientPool.instance;
  }

  public async getClient(): Promise<DbClient> {
    return PostgresDbClientPool.pool.connect();
  }
}
