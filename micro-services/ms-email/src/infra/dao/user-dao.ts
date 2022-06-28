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
import { DbClientManager, IUserDao } from '../contracts'

export class UserDao implements IUserDao {
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

    const parsedResponse: User = {
      id: response.insertedId.valueOf(),
      ...user,
    }

    return parsedResponse
  }
}
