/**
 * Infra
 */
import { DbClient, DbClientPool } from '../../contracts'
import { DbDirector } from '../helpers/builders/db-director'

/**
 * Drivers
 */
import { MongoClient } from 'mongodb'

/**
 * Infra
 */
import { MongoClientBuilder } from '../helpers/builders/mongo-builder'

/**
 * @author Gabriel Ferrari Tarallo Ferraz <gftf2011@gmail.com>
 * @desc Garantees that only one instance from the object will exists in project
 * It uses the {@link https://refactoring.guru/pt-br/design-patterns/singleton Singleton} design pattern
 */
export class MongoDbClientPool {
  private static pool: MongoClient
  private static instance: MongoDbClientPool

  private constructor() {}

  static connect(): void {
    if (!MongoDbClientPool.pool) {
      const builder = new MongoClientBuilder()
      const director = new DbDirector()

      director.setBuilder(builder)

      MongoDbClientPool.pool = director.getDbClient()
    }
  }

  static getInstance(): DbClientPool {
    if (!MongoDbClientPool.instance) {
      MongoDbClientPool.instance = new MongoDbClientPool()
    }
    return MongoDbClientPool.instance
  }

  public async getClient(): Promise<DbClient> {
    return MongoDbClientPool.pool.connect()
  }
}
