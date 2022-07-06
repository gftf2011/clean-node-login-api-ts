/**
 * Use Cases
 */
import { AccountDto as Account } from './account-dto'
import { AuthenticatedAccountDto } from './authenticated-account-dto'

/**
 * Shared
 */
import { Either } from '../../shared'

/**
 * Use Cases
 */
import { BasicUserDto as User } from './user-dto'

export interface IHttpAuthService {
  signUp: (
    user: User,
    host: string
  ) => Promise<Either<Error, AuthenticatedAccountDto>>
  signIn(
    account: Account,
    host: string
  ): Promise<Either<Error, AuthenticatedAccountDto>>
}
