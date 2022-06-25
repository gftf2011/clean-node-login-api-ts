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

export class MongoDbClientManager implements DbClientManager {
  private _client: DbClient

  private session: DbSession

  constructor(
    private readonly pool: DbClientPool,
    private readonly transaction: DbTransactionSession,
    private readonly queryRunner: DbQueryRunner
  ) {}

  public async createClient(): Promise<void> {
    this._client = await this.pool.getClient()
  }

  public async openTransaction(): Promise<void> {
    this.session = await this.transaction.getSession()
  }

  public async query(tableOrCollection: string, ...args: any): Promise<any> {
    const context = new DbQueryRunnerContext(this.queryRunner)
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
