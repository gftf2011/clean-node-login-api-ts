/**
 * Domain
 */
import { UserEntity as User } from '@/entities'

/**
 * Infra
 */
import { IUserDao } from '@/infra/contracts'

export class UserDaoPostgres implements IUserDao {
  private readonly users: User[] = []

  async create (user: User): Promise<void> {
    this.users.push(user)
  }
}
