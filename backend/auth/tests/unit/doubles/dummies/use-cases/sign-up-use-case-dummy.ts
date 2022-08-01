import { Either } from '../../../../../src/shared';
// eslint-disable-next-line sort-imports
import {
  AuthenticatedAccountDto,
  BasicUserDto,
  ISignUpUseCase,
} from '../../../../../src/use-cases/ports';

export class SignUpUseCaseDummy implements ISignUpUseCase {
  perform: (
    request: BasicUserDto,
    host: string,
  ) => Promise<Either<Error, AuthenticatedAccountDto>>;
}
