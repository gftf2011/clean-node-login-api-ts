import { Either, left } from '../../../../../src/shared';
import { UnauthorizedError } from '../../../../../src/shared/errors';
// eslint-disable-next-line sort-imports
import {
  AuthenticatedAccountDto,
  BasicUserDto,
  ISignUpUseCase,
} from '../../../../../src/use-cases/ports';

export class PerformUnauthorizedErrorSignUpUseCaseStub
  implements ISignUpUseCase
{
  perform(
    _request: BasicUserDto,
    _host: string,
  ): Promise<Either<Error, AuthenticatedAccountDto>> {
    return left(new UnauthorizedError()) as any;
  }
}
