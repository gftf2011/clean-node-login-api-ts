/**
 * Use Cases
 */
import { RefreshTokenDto as RefreshToken } from '@/use-cases/ports'

export interface IRefreshTokenDao {
  create: (refreshToken: RefreshToken) => Promise<RefreshToken>
}
