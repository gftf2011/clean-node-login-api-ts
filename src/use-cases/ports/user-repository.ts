/**
 * Domain
 */
import { UserEntity as User } from '@/entities'

export interface IUserRepository {
  create: (user: User) => Promise<void>
}
