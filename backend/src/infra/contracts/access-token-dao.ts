/**
 * Use Cases
 */
import { AccessTokenDto as AccessToken } from '@/use-cases/ports'

export interface IAccessTokenDao {
  create: (accessToken: string) => Promise<AccessToken>
  deleteById: (id: string) => Promise<AccessToken>
  updateToken: (accessTokenId: string, token: string) => Promise<AccessToken>
}
 