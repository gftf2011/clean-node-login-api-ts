/**
 * Use Cases
 */
import { UserDto as User } from '@/use-cases/ports'

/**
 * Infrastructure
 */
import { IUserDao, DbTransaction } from '@/infra/contracts'

export class UserDao implements IUserDao {
  private readonly users: User[] = []

  constructor (private readonly dbClient: DbTransaction) {}

  async create (user: User): Promise<User> {
    this.users.push(user)
    return user
  }
}
