/**
 * Use Cases
 */
import { IUserRepository, UserDto as User } from '@/use-cases/ports'

/**
 * Infrastructure
 */
import { IUserDao } from '@/infra/contracts'

export class UserRepository implements IUserRepository {
  private readonly userDAO: IUserDao

  constructor (userDAO: IUserDao) {
    this.userDAO = userDAO
  }

  async create (user: User): Promise<User> {
    return await this.userDAO.create(user)
  }
}
