/**
 * Drivers
 */
import { MongoClient, ReadPreference } from 'mongodb';

/**
 * Infra
 */
// eslint-disable-next-line sort-imports
import {
  DbClient,
  DbClientPool,
  DbSession,
  DbTransactionSession,
} from '../../contracts';
import { DbDirector } from '../helpers/builders/db-director';
import { MongoClientBuilder } from '../helpers/builders/mongo-builder';

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Garantees that only one instance from the object will exists in project
 * It uses the {@link https://refactoring.guru/pt-br/design-patterns/singleton Singleton} design pattern
 */
export class MongoDbClientPool implements DbClientPool, DbTransactionSession {
  private static pool: MongoClient;

  private static instance: MongoDbClientPool;

  private constructor() {}

  static connect(): void {
    if (!MongoDbClientPool.pool) {
      const builder = new MongoClientBuilder();
      const director = new DbDirector();

      director.setBuilder(builder);

      MongoDbClientPool.pool = director.getDbClient();
    }
  }

  static getInstance(): DbClientPool & DbTransactionSession {
    if (!MongoDbClientPool.instance) {
      MongoDbClientPool.instance = new MongoDbClientPool();
    }
    return MongoDbClientPool.instance;
  }

  public async getClient(): Promise<DbClient> {
    return MongoDbClientPool.pool.connect();
  }

  public async getSession(): Promise<DbSession> {
    return MongoDbClientPool.pool.startSession({
      defaultTransactionOptions: {
        readPreference: new ReadPreference(ReadPreference.PRIMARY),
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' },
      },
    });
  }
}
