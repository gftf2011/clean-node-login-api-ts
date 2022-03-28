/**
 * Use Cases
 */
import { UserDto as User } from '@/use-cases/ports'

export interface IUserRepository {
  create: (user: User) => Promise<User>
}
