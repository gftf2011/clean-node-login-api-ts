/**
 * Shared
 */
import { Either } from '../../shared';

export interface TokenOptions {
  subject: string; // Must be a globally unique id
  issuer: string; // Value from URI that is calling for the token, example http://localhost:3333
  jwtId: string;
}

export interface ITokenService {
  sign: <T>(
    payload: T,
    options: TokenOptions,
    expirationTime: number,
  ) => Either<Error, string>;
  verify: (token: string, options: TokenOptions) => Either<Error, any>;
}
