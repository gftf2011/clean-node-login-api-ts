import jwt from 'jsonwebtoken'

/**
 * Use Cases
 */
import { ITokenService, TokenOptions } from '@/use-cases/ports'

/**
 * Shared
 */
import { Either, left, right } from '@/shared'
import { ServerError, UnauthorizedError } from '@/shared/errors'

const JWT_SECRET: string = process.env.JWT_SECRET // Token signature
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN
const JWT_ALGORITHM: jwt.Algorithm = process.env.JWT_ALGORITHM as jwt.Algorithm // JWA - (Json Web Algorithm)

interface CustomJwtPayload extends jwt.JwtPayload {
  data: any
}

export class JwtTokenService implements ITokenService {
  sign <T>(payload: T, options: TokenOptions): Either<Error, string> {
    if (!JWT_SECRET || !JWT_EXPIRES_IN || !JWT_ALGORITHM) {
      return left(new ServerError())
    }

    // Optional, but recomended claims
    const registeredClaims = {
      subject: options.subject,
      issuer: options.issuer
    }

    const jsonWebToken: string = jwt.sign({ data: payload }, JWT_SECRET, {
      algorithm: JWT_ALGORITHM,
      expiresIn: JWT_EXPIRES_IN,
      subject: registeredClaims.subject,
      issuer: registeredClaims.issuer
    })

    return right(`Bearer ${jsonWebToken}`)
  }

  verify <T>(token: string, options: TokenOptions): Either<Error, T> {
    if (!JWT_SECRET || !JWT_ALGORITHM) {
      return left(new ServerError())
    }

    const [, tokenBody] = token.split('Bearer ')

    const registeredClaims = {
      subject: options.subject,
      issuer: options.issuer
    }

    try {
      const { data } = jwt.verify(tokenBody, JWT_SECRET, {
        algorithms: [JWT_ALGORITHM],
        subject: registeredClaims.subject,
        issuer: registeredClaims.issuer
      }) as CustomJwtPayload

      return right(data as T)
    } catch (error) {
      return left(new UnauthorizedError())
    }
  }
}
