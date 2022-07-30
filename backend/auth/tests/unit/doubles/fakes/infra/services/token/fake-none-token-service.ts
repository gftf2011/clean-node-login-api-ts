/**
 * Shared
 */
import { Either, right } from '../../../../../../../src/shared';

/**
 * Use Cases
 */
import {
  ITokenService,
  TokenOptions,
} from '../../../../../../../src/use-cases/ports';

export class FakeNoneTokenService implements ITokenService {
  sign<T>(
    payload: T,
    options: TokenOptions,
    _expirationTime: number,
  ): Promise<Either<Error, string>> {
    const token = {
      options,
      data: payload,
    };
    return Promise.resolve(right(JSON.stringify(token)));
  }

  verify(token: string, options: TokenOptions): Promise<Either<Error, any>> {
    const parsedToken: { options: TokenOptions; data: any } = JSON.parse(token);

    if (
      parsedToken.options.issuer === options.issuer &&
      parsedToken.options.jwtId === options.jwtId &&
      parsedToken.options.subject === options.subject
    ) {
      const response = { data: parsedToken.data };
      return Promise.resolve(right(response));
    }
    throw new Error();
  }
}
