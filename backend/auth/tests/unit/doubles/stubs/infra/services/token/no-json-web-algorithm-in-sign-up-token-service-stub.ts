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
  ): Promise<Either<Error, string>> {
    if (!JWT_SECRET || !JWT_ALGORITHM) {
      return left(new ServerError()) as any;
    }

    return right('jsonWebToken') as any;
  }

  verify: (token: string, options: TokenOptions) => Promise<Either<Error, any>>;
}
