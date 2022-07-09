/**
 * Use Cases
 */
import { AuthenticatedAccountDto, BasicUserDto } from '.';

/**
 * Shared
 */
import { Either } from '../../shared';

export interface ISignUpUseCase {
  perform: (
    request: BasicUserDto,
    host: string,
  ) => Promise<Either<Error, AuthenticatedAccountDto>>;
}
