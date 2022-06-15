/**
 * Use Cases
 */
import { IUserRepository, UserDto as User } from '../../use-cases/ports'

/**
 * Infrastructure
 */
import { IUserDao } from '../contracts'

export class UserRepository implements IUserRepository {
  private readonly userDAO: IUserDao

  constructor (userDAO: IUserDao) {
    this.userDAO = userDAO
  }

  async create (user: User): Promise<User> {
    const userResponse = await this.userDAO.create(user)
    return userResponse
  }

  async findUserByEmail (email: string): Promise<User> {
    return await this.userDAO.findUserByEmail(email)
  }
}
