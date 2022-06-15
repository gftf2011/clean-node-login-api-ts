import jwt from 'jsonwebtoken'

/**
 * Use Cases
 */
import { ITokenService, TokenOptions } from '../../../use-cases/ports'

/**
 * Shared
 */
import { Either, left, right } from '../../../shared'
import { ServerError, UnauthorizedError } from '../../../shared/errors'

const JWT_SECRET: string = process.env.JWT_SECRET // Token signature
const JWT_ALGORITHM: jwt.Algorithm = process.env.JWT_ALGORITHM as jwt.Algorithm // JWA - (Json Web Algorithm)

interface CustomJwtPayload extends jwt.JwtPayload {
  data: any
}

export class JwtTokenService implements ITokenService {
  sign <T>(payload: T, options: TokenOptions, expirationTime: number): Either<Error, string> {
    if (!JWT_SECRET || !JWT_ALGORITHM) {
      return left(new ServerError())
    }

    /**
     * Optional, but recomended claims
     */
    const registeredClaims = {
      subject: options.subject,
      issuer: options.issuer,
      jwtId: options.jwtId
    }

    const jsonWebToken: string = jwt.sign({ data: payload }, JWT_SECRET, {
      expiresIn: expirationTime,
      header: {
        typ: 'JWT',
        alg: JWT_ALGORITHM
      },
      subject: registeredClaims.subject,
      issuer: registeredClaims.issuer,
      jwtid: registeredClaims.jwtId
    })

    return right(`${jsonWebToken}`)
  }

  verify (token: string, options: TokenOptions): Either<Error, CustomJwtPayload> {
    if (!JWT_SECRET || !JWT_ALGORITHM) {
      return left(new ServerError())
    }

    const registeredClaims = {
      subject: options.subject,
      issuer: options.issuer,
      jwtId: options.jwtId
    }

    try {
      const response = jwt.verify(token, JWT_SECRET, {
        algorithms: [JWT_ALGORITHM],
        subject: registeredClaims.subject,
        issuer: registeredClaims.issuer,
        jwtid: registeredClaims.jwtId
      }) as CustomJwtPayload

      return right(response)
    } catch (error) {
      return left(new UnauthorizedError())
    }
  }
}
