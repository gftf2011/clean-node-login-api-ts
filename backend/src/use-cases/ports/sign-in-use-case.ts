/**
 * Use Cases
 */
import { AuthenticatedAccountDto, AccountDto } from '../ports'

/**
  * Shared
  */
import { Either } from '../../shared/either'

export interface ISignInUseCase {
  perform: (request: AccountDto, host: string) => Promise<Either<Error, AuthenticatedAccountDto>>
}
