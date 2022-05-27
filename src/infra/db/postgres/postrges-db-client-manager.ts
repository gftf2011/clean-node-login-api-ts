/**
 * Infrastructure
 */
import { DbClient, DbClientManager, DbQuery } from '@/infra/contracts'
import { PostgresDbQuery } from './postgres-db-query'

export class PostgresDbClientManager implements DbClientManager {
  constructor (private readonly client: DbClient) {}

  public async openTransaction (): Promise<void> {
    await this.client.query('BEGIN')
  }

  public query (): DbQuery {
    return new PostgresDbQuery(this.client)
  }

  public async closeTransaction (): Promise<void> {
    this.client.release()
  }

  public async commit (): Promise<void> {
    await this.client.query('COMMIT')
  }

  public async rollback (): Promise<void> {
    await this.client.query('ROLLBACK')
  }
}
