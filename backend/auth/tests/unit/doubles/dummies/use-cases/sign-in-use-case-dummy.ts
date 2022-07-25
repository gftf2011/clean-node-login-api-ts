import { Either } from '../../../../../src/shared';
// eslint-disable-next-line sort-imports
import {
  AccountDto,
  AuthenticatedAccountDto,
  ISignInUseCase,
} from '../../../../../src/use-cases/ports';

export class SignInUseCaseDummy implements ISignInUseCase {
  perform: (
    request: AccountDto,
    host: string,
  ) => Promise<Either<Error, AuthenticatedAccountDto>>;
}
