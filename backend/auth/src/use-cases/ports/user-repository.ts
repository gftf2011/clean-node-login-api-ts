/**
 * Use Cases
 */
import { UserDto as User } from '.'

export interface IUserRepository {
  create: (user: User) => Promise<User>
  findUserByEmail: (email: string) => Promise<User>
}
