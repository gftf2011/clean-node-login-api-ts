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

  async deleteById (id: string): Promise<AccessToken> {
    const statement: string = 'DELETE FROM users_schema.access_token WHERE id = $1 RETURNING *'

    const values: any[] = [id]

    const response = await this.dbClientManager.query(statement, values)
    const parsedResponse: AccessToken = {
      id: response.rows[0].id,
      token: response.rows[0].token
    }
    return parsedResponse
  }

  async updateToken (accessTokenId: string, token: string): Promise<AccessToken> {
    const statement: string = 'UPDATE users_schema.access_token SET token = $1 WHERE id = $2 RETURNING *'

    const values: any[] = [token, accessTokenId]

    const response = await this.dbClientManager.query(statement, values)
    const parsedResponse: AccessToken = {
      id: response.rows[0].id,
      token: response.rows[0].token
    }
    return parsedResponse
  }
}
 