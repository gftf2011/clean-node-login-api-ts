/**
 * Use Cases
 */
import { AccessTokenDto as AccessToken } from '@/use-cases/ports'

export interface IAccessTokenDao {
  create: (accessToken: string) => Promise<AccessToken>
}
 