import { Either, right } from '../../../../../src/shared';
// eslint-disable-next-line sort-imports
import {
  AccountDto,
  AuthenticatedAccountDto,
  ISignInUseCase,
} from '../../../../../src/use-cases/ports';

export class PerformSuccessSignInUseCaseStub implements ISignInUseCase {
  perform(
    _request: AccountDto,
    _host: string,
  ): Promise<Either<Error, AuthenticatedAccountDto>> {
    return Promise.resolve(
      right({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      } as AuthenticatedAccountDto),
    );
  }
}
