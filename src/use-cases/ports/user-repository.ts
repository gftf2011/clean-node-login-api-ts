/**
 * Use Cases
 */
import { UserDto as User, RefreshTokenDto as RefreshToken } from '@/use-cases/ports'

export interface IUserRepository {
  create: (user: User, refreshToken: RefreshToken) => Promise<User>
  findUserByEmail: (email: string) => Promise<User>
  updateUserRefreshToken: (refreshTokenId: string, expiresIn: number) => Promise<void>
}
