/**
 * Use Cases
 */
import {
  BasicUserDto as BasicUser,
  UserDto as User,
} from '../../use-cases/ports'

/**
 * Infra
 */
import { DbClientManager } from '../contracts'

export class UserDao {
  constructor(private readonly dbClientManager: DbClientManager) {}

  async create(user: BasicUser): Promise<User> {
    const tableOrCollection: string = 'users'

    const documentsAndFilters = {
      documents: [user],
    }

    const response = await this.dbClientManager.query(
      'INSERT_ONE',
      tableOrCollection,
      documentsAndFilters
    )
    // const parsedResponse: User = {
    //   id: response.rows[0].id,
    //   email: response.rows[0].email,
    //   lastname: response.rows[0].lastname,
    //   name: response.rows[0].name,
    //   password: response.rows[0].password,
    //   taxvat: response.rows[0].taxvat,
    //   confirmed: response.rows[0].confirmed,
    // }
    return response as any
  }
}
