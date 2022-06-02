/**
 * Use Cases
 */
import { RefreshTokenDto as RefreshToken } from '@/use-cases/ports'

export interface IRefreshTokenDao {
  create: (refreshToken: RefreshToken) => Promise<RefreshToken>
  updateExpiresIn: (refreshTokenId: string, expiresIn: number) => Promise<RefreshToken>
}
