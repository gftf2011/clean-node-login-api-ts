/**
 * Use Cases
 */
import { AccessTokenDto as AccessToken } from '@/use-cases/ports'

/**
 * Infrastructure
 */
import { IAccessTokenDao, DbClientManager } from '@/infra/contracts'

export class AccessTokenDao implements IAccessTokenDao {
  constructor (private readonly dbClientManager: DbClientManager) {}

  async create (accessToken: string): Promise<AccessToken> {
    const statement: string = 'INSERT INTO users_schema.access_token(token) VALUES($1) RETURNING *'

    const values: any[] = [accessToken]

    const response = await this.dbClientManager.query(statement, values)
    const parsedResponse: AccessToken = {
      id: response.rows[0].id,
      token: response.rows[0].token
    }
    return parsedResponse
  }
}
 