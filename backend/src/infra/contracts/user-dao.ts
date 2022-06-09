/**
 * Use Cases
 */
import { UserDto as User } from '@/use-cases/ports'

export interface IUserDao {
  create: (user: User, refreshTokenId: string) => Promise<User>
  findUserByEmail: (email: string) => Promise<User>
  updateRefreshTokenId: (oldRefreshTokenId: string, newRefreshTokenId: string) => Promise<User>
}
