/**
 * Use Cases
 */
import { RefreshTokenDto as RefreshToken } from '@/use-cases/ports'

/**
  * Infrastructure
  */
import { IRefreshTokenDao, DbClientManager } from '@/infra/contracts'

export class RefreshTokenDao implements IRefreshTokenDao {
  constructor (private readonly dbClientManager: DbClientManager) {}

  async create (refreshToken: RefreshToken): Promise<RefreshToken> {
    const statement: string = 'INSERT INTO users_schema.refresh_token(expires_in) VALUES($1) RETURNING *'

    const values: any[] = [refreshToken.expiresIn]

    const response = await this.dbClientManager.query(statement, values)
    const parsedResponse: RefreshToken = {
      id: response.rows[0].id,
      expiresIn: response.rows[0].expires_in
    }
    return parsedResponse
  }

  async updateExpiresIn (refreshTokenId: string, expiresIn: number): Promise<RefreshToken> {
    const statement: string = 'UPDATE users_schema.refresh_token SET expires_in = $1 WHERE id = $2 RETURNING *'

    const values: any[] = [expiresIn, refreshTokenId]

    const response = await this.dbClientManager.query(statement, values)
    const parsedResponse: RefreshToken = {
      id: response.rows[0].id,
      expiresIn: response.rows[0].expires_in
    }
    return parsedResponse
  }
}
