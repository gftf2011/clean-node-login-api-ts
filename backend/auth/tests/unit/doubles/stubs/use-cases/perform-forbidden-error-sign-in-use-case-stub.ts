import { Either, left } from '../../../../../src/shared';
import { ForbiddenError } from '../../../../../src/shared/errors';
// eslint-disable-next-line sort-imports
import {
  AccountDto,
  AuthenticatedAccountDto,
  ISignInUseCase,
} from '../../../../../src/use-cases/ports';

export class PerformForbiddenErrorSignInUseCaseStub implements ISignInUseCase {
  perform(
    _request: AccountDto,
    _host: string,
  ): Promise<Either<Error, AuthenticatedAccountDto>> {
    return left(new ForbiddenError()) as any;
  }
}
