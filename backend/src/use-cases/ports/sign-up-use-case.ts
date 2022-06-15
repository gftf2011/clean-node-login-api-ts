/**
 * Use Cases
 */
import { AuthenticatedAccountDto, BasicUserDto } from '../ports'

/**
 * Shared
 */
import { Either } from '../../shared/either'

export interface ISignUpUseCase {
  perform: (request: BasicUserDto, host: string) => Promise<Either<Error, AuthenticatedAccountDto>>
}
