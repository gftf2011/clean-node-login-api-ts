import { Either, left } from '../../../../../src/shared';
import { UnauthorizedError } from '../../../../../src/shared/errors';
// eslint-disable-next-line sort-imports
import {
  AccountDto,
  AuthenticatedAccountDto,
  ISignInUseCase,
} from '../../../../../src/use-cases/ports';

export class PerformUnauthorizedErrorSignInUseCaseStub
  implements ISignInUseCase
{
  perform(
    _request: AccountDto,
    _host: string,
  ): Promise<Either<Error, AuthenticatedAccountDto>> {
    return left(new UnauthorizedError()) as any;
  }
}
