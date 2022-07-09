/**
 * Use Cases
 */
import { AccountDto, AuthenticatedAccountDto } from '.';

/**
 * Shared
 */
import { Either } from '../../shared';

export interface ISignInUseCase {
  perform: (
    request: AccountDto,
    host: string,
  ) => Promise<Either<Error, AuthenticatedAccountDto>>;
}
