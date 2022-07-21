/**
 * Shared
 */
import { Either, left, right } from '../../../../../../../src/shared';

/**
 * Use Cases
 */
import {
  ITokenService,
  TokenOptions,
} from '../../../../../../../src/use-cases/ports';

/**
 * Shared
 */
import { ServerError } from '../../../../../../../src/shared/errors';

const { JWT_SECRET } = process.env; // Token signature
const JWT_ALGORITHM: any = null;

export class NoJsonWebAlgorithmInSignUpTokenServiceStub
  implements ITokenService
{
  sign<T>(
    _payload: T,
    _options: TokenOptions,
    _expirationTime: number,
  ): Either<Error, string> {
    if (!JWT_SECRET || !JWT_ALGORITHM) {
      return left(new ServerError());
    }

    return right('jsonWebToken');
  }

  verify: (token: string, options: TokenOptions) => Either<Error, any>;
}
