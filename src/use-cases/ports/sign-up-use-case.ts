/**
 * Use Cases
 */
import { UserDto, BasicUserDto } from '@/use-cases/ports'

/**
 * Shared
 */
import { Either } from '@/shared/either'

export interface ISignUpUseCase {
  perform: (request: BasicUserDto) => Promise<Either<Error, UserDto>>
}
