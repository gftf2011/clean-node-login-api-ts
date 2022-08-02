/**
 * Infra
 */
import { Pool, PoolClient } from 'pg';
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
 * It uses the {@link https://refactoring.guru/design-patterns/singleton Singleton} design pattern
 */
export class PostgresDbClientPool implements DbClientPool {
  private static pool: Pool;

  private static instance: PostgresDbClientPool;

  private constructor() {}

  static async connect(): Promise<void> {
    if (!PostgresDbClientPool.pool) {
      const builder = new PgClientBuilder();

      const director = new DbDirector();
      director.setBuilder(builder);

      let poolConnection: PoolClient;

      const pool: Pool = director.getDbClient();

      /**
       * Retry connection logic, postgres pool must
       * be tested before clients are created
       */
      while (!poolConnection) {
        try {
          poolConnection = await pool.connect();
        } catch (err) {
          poolConnection = null;
        }
      }

      PostgresDbClientPool.pool = pool;
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
