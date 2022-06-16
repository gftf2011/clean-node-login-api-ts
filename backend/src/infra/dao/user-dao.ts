/**
 * Infra
 */
import { DbClientManager, IUserDao } from '../contracts'

/**
 * Use Cases
 */
import { UserDto as User } from '../../use-cases/ports'

export class UserDao implements IUserDao {
  constructor (private readonly dbClientManager: DbClientManager) {}

  async create (user: User): Promise<User> {
    const statement: string = 'INSERT INTO users_schema.users(name, lastname, taxvat, email, password) VALUES($1, $2, $3, $4, $5) RETURNING *'

    const values: any[] = [user.name, user.lastname, user.taxvat, user.email, user.password]

    const response = await this.dbClientManager.query(statement, values)
    const parsedResponse: User = {
      id: response.rows[0].id,
      email: response.rows[0].email,
      lastname: response.rows[0].lastname,
      name: response.rows[0].name,
      password: response.rows[0].password,
      taxvat: response.rows[0].taxvat
    }
    return parsedResponse
  }

  async findUserByEmail (email: string): Promise<User> {
    const statement: string = 'SELECT * FROM users_schema.users WHERE email LIKE $1'

    const values: any[] = [email]

    const response = await this.dbClientManager.query(statement, values)
    const parsedResponse: User = response.rows[0]
      ? {
          id: response.rows[0].id,
          email: response.rows[0].email,
          lastname: response.rows[0].lastname,
          name: response.rows[0].name,
          password: response.rows[0].password,
          taxvat: response.rows[0].taxvat
        }
      : undefined
    return parsedResponse
  }
}
