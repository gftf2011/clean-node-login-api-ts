/**
 * Shared
 */
import { Either, left, right } from '../../../shared';

/**
 * Use Cases
 */
import { ITokenService, TokenOptions } from '../../../use-cases/ports';

/**
 * Shared
 */
import { ServerError, UnauthorizedError } from '../../../shared/errors';

/**
 * Driver
 */
// eslint-disable-next-line import/order
import jwt from 'jsonwebtoken';

interface CustomJwtPayload extends jwt.JwtPayload {
  data: any;
}

export class JwtTokenService implements ITokenService {
  async sign<T>(
    payload: T,
    options: TokenOptions,
    expirationTime: number,
  ): Promise<Either<Error, string>> {
    if (!process.env.JWT_SECRET || !process.env.JWT_ALGORITHM) {
      return left(new ServerError());
    }

    /**
     * Optional, but recomended claims
     */
    const registeredClaims = {
      subject: options.subject,
      issuer: options.issuer,
      jwtId: options.jwtId,
    };

    const jsonWebToken: string = jwt.sign(
      { data: payload },
      process.env.JWT_SECRET,
      {
        expiresIn: expirationTime,
        header: {
          typ: 'JWT',
          alg: process.env.JWT_ALGORITHM,
        },
        subject: registeredClaims.subject,
        issuer: registeredClaims.issuer,
        jwtid: registeredClaims.jwtId,
      },
    );

    return right(`${jsonWebToken}`);
  }

  async verify(
    token: string,
    options: TokenOptions,
  ): Promise<Either<Error, CustomJwtPayload>> {
    if (!process.env.JWT_SECRET || !process.env.JWT_ALGORITHM) {
      return left(new ServerError());
    }

    const registeredClaims = {
      subject: options.subject,
      issuer: options.issuer,
      jwtId: options.jwtId,
    };

    const response = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: [process.env.JWT_ALGORITHM as jwt.Algorithm],
      subject: registeredClaims.subject,
      issuer: registeredClaims.issuer,
      jwtid: registeredClaims.jwtId,
    });

    return right(response) as any;
  }
}
