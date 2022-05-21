/**
 * Use Cases
 */
import { RefreshTokenDto as RefreshToken } from '@/use-cases/ports'

/**
  * Infrastructure
  */
import { IRefreshTokenDao, DbTransaction } from '@/infra/contracts'

export class RefreshTokenDao implements IRefreshTokenDao {
  constructor (private readonly dbClient: DbTransaction) {}

  async create (refreshToken: RefreshToken): Promise<RefreshToken> {
    const statement: string = 'INSERT INTO users_schema.refresh_token(expires_in) VALUES($1) RETURNING *'

    const values: any[] = [refreshToken.expiresIn]

    const client = await this.dbClient.client()

    try {
      await this.dbClient.openTransaction(client)
      const response = await this.dbClient.transaction(client, statement, values)
      await this.dbClient.commit(client)
      await this.dbClient.closeTransaction(client)
      const parsedResponse: RefreshToken = {
        id: response.rows[0].id,
        expiresIn: response.rows[0].expires_in
      }
      return parsedResponse
    } catch (err) {
      await this.dbClient.rollback(client)
      await this.dbClient.closeTransaction(client)
      throw err
    }
  }
}
