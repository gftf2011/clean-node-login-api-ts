/**
 * Infra
 */
import {
  DbClient,
  DbClientManager,
  DbClientPool,
  DbQueryRunner,
  DbSession,
  DbTransactionSession,
} from '../../contracts'
import { DbQueryRunnerContext } from '../helpers/strategy/db-query-runner-context'
import { MongoDbFindOneQueryRunnerStrategy } from '../helpers/strategy/mongo-db-find-one-query-runner-strategy'
import { MongoDbInsertOneQueryRunnerStrategy } from '../helpers/strategy/mongo-db-insert-one-query-runner-strategy'

export class MongoDbClientManager implements DbClientManager {
  private client: DbClient

  private session: DbSession

  constructor(
    private readonly pool: DbClientPool,
    private readonly transaction: DbTransactionSession,
    private readonly queryRunner: DbQueryRunner
  ) {}

  public async createClient(): Promise<void> {
    this.client = await this.pool.getClient()
  }

  public async openTransaction(): Promise<void> {
    this.session = await this.transaction.getSession()
  }

  public async query(
    operation: 'INSERT_ONE' | 'FIND_ONE',
    tableOrCollection: string,
    ...args: any
  ): Promise<any> {
    let context
    if (operation === 'INSERT_ONE') {
      context = new DbQueryRunnerContext(
        new MongoDbInsertOneQueryRunnerStrategy(this.client)
      )
    } else if (operation === 'FIND_ONE') {
      context = new DbQueryRunnerContext(
        new MongoDbFindOneQueryRunnerStrategy(this.client)
      )
    }
    return context.executeQuery(tableOrCollection, ...args)
  }

  public async closeTransaction(): Promise<void> {
    await this.session.endSession()
  }

  public async commit(): Promise<void> {
    await this.session.commitTransaction()
  }

  public async rollback(): Promise<void> {
    await this.session.abortTransaction()
  }
}
