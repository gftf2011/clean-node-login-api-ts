/**
 * Infra
 */
import { DbClient, DbClientManager, DbClientPool } from '../../contracts'

export class PostgresDbClientManager implements DbClientManager {
  private client: DbClient

  constructor(private readonly pool: DbClientPool) {}

  public async createClient(): Promise<void> {
    this.client = await this.pool.getClient()
  }

  public async openTransaction(): Promise<void> {
    await this.client.query('BEGIN')
  }

  public async query(statement: string, values: any[]): Promise<any> {
    return this.client.query(statement, values)
  }

  public async closeTransaction(): Promise<void> {
    this.client.release()
  }

  public async commit(): Promise<void> {
    await this.client.query('COMMIT')
  }

  public async rollback(): Promise<void> {
    await this.client.query('ROLLBACK')
  }
}
