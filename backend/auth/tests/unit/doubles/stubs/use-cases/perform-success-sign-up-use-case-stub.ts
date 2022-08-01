import { Either, right } from '../../../../../src/shared';
// eslint-disable-next-line sort-imports
import {
  AuthenticatedAccountDto,
  BasicUserDto,
  ISignUpUseCase,
} from '../../../../../src/use-cases/ports';

export class PerformSuccessSignUpUseCaseStub implements ISignUpUseCase {
  perform(
    _request: BasicUserDto,
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
