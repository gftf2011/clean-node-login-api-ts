/**
 * Use Cases
 */
import { UserDto as User } from '@/use-cases/ports'

/**
 * Infrastructure
 */
import { IUserDao, DbTransaction } from '@/infra/contracts'

export class UserDao implements IUserDao {
  constructor (private readonly dbClient: DbTransaction) {}

  async create (user: User, refreshTokenId: string): Promise<User> {
    const statement: string = 'INSERT INTO users_schema.users(name, lastname, taxvat, email, password, refresh_token_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *'

    const values: any[] = [user.name, user.lastname, user.taxvat, user.email, user.password, refreshTokenId]

    const client = await this.dbClient.client()

    try {
      await this.dbClient.openTransaction(client)
      const response = await this.dbClient.transaction(client, statement, values)
      await this.dbClient.commit(client)
      await this.dbClient.closeTransaction(client)
      const parsedResponse: User = {
        id: response.rows[0].id,
        email: response.rows[0].email,
        lastname: response.rows[0].lastname,
        name: response.rows[0].name,
        password: response.rows[0].password,
        taxvat: response.rows[0].taxvat,
        refreshTokenId: response.rows[0].refresh_token_id
      }
      return parsedResponse
    } catch (err) {
      await this.dbClient.rollback(client)
      await this.dbClient.closeTransaction(client)
      throw err
    }
  }

  async findUserByEmail (email: string): Promise<User> {
    const statement: string = 'SELECT * FROM users_schema.users WHERE email = $1'

    const values: any[] = [email]

    const client = await this.dbClient.client()

    try {
      await this.dbClient.openTransaction(client)
      const response = await this.dbClient.transaction(client, statement, values)
      await this.dbClient.commit(client)
      await this.dbClient.closeTransaction(client)
      return response.rows[0]
    } catch (err) {
      await this.dbClient.rollback(client)
      await this.dbClient.closeTransaction(client)
      throw err
    }
  }
}
