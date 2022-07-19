import { Either } from '../../../../../../../src/shared';
// eslint-disable-next-line sort-imports
import {
  ITokenService,
  TokenOptions,
} from '../../../../../../../src/use-cases/ports';

export class JWTTokenServiceDummy implements ITokenService {
  sign: <T>(
    payload: T,
    options: TokenOptions,
    expirationTime: number,
  ) => Either<Error, string>;

  verify: (token: string, options: TokenOptions) => Either<Error, any>;
}
