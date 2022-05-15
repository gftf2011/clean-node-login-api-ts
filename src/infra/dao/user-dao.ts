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

  async create (user: User): Promise<User> {
    const statement: string = 'INSERT INTO users(name, lastname, taxvat, email, password, refresh_token_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *'

    const values: any[] = [user.name, user.lastname, user.taxvat, user.email, user.password, user.refreshTokenId]

    const client = await this.dbClient.client()
    try {
      await this.dbClient.openTransaction(client)
      await this.dbClient.transaction(client, statement, values)
      await this.dbClient.commit(client)
      await this.dbClient.closeTransaction(client)
      return user
    } catch (err) {
      await this.dbClient.rollback(client)
      await this.dbClient.closeTransaction(client)
      throw err
    }
  }

  async findUserByEmail (email: string): Promise<User> {
    const statement: string = 'SELECT * FROM users WHERE email = $1 RETURNING *'

    const values: any[] = [email]

    const client = await this.dbClient.client()

    try {
      const response = await this.dbClient.transaction(client, statement, values)
      await this.dbClient.closeTransaction(client)
      return response[0]
    } catch (err) {
      await this.dbClient.closeTransaction(client)
      throw err
    }
  }
}
