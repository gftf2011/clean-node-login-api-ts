/**
 * Infrastructure
 */
import { DbClient, DbQuery } from '@/infra/contracts'

export class PostgresDbQuery implements DbQuery {
  constructor (private readonly client: DbClient) {}

  public async execute (statement: string, values: any[]): Promise<any> {
    const result = await this.client.query(statement, values)
    return result
  }
}
