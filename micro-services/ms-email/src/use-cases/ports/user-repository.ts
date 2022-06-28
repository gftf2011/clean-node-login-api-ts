/**
 * Use Cases
 */
import { UserDto as User } from '../ports'

export interface IUserRepository {
  create: (user: User) => Promise<User>
}
