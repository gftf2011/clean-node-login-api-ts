/**
 * Domain
 */
import { UserEntity } from '@/entities'

/**
 * Use Cases
 */
import { IUserRepository } from '@/use-cases/ports/user-repository'

/**
 * Infra
 */
import { IUserDao } from '@/infra/contracts'

export class UserRepository implements IUserRepository {
  private readonly userDAO: IUserDao

  constructor (userDAO: IUserDao) {
    this.userDAO = userDAO
  }

  async create (user: UserEntity): Promise<void> {
    await this.userDAO.create(user)
  }
}
