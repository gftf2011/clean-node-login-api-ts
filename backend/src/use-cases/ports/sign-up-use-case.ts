/**
 * Use Cases
 */
import { AuthenticatedAccountDto, BasicUserDto } from '@/use-cases/ports'

/**
 * Shared
 */
import { Either } from '@/shared/either'

export interface ISignUpUseCase {
  perform: (request: BasicUserDto, host: string, subject: string) => Promise<Either<Error, AuthenticatedAccountDto>>
}
