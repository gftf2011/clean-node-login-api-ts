/**
 * Use Cases
 */
import { UserDto as User, RefreshTokenDto as RefreshToken } from '@/use-cases/ports'

export interface IUserRepository {
  create: (user: User, refreshToken: RefreshToken) => Promise<User>
  findUserByEmail: (email: string) => Promise<User>
  updateUserRefreshToken: (oldRefreshTokenId: string, refreshToken: RefreshToken) => Promise<User>
}
