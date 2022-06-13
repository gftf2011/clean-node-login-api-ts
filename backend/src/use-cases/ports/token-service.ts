/**
 * Shared
 */
import { Either } from '@/shared'

export interface TokenOptions {
  subject: string // Must be a globally unique id, example the user email
  issuer: string // Value from URI that is calling for the token, example http://localhost:3333
}

export interface ITokenService {
  sign: <T>(payload: T, options: TokenOptions, expirationTime: number, jwtId: string) => Either<Error, string>
  verify: <T>(token: string, options: TokenOptions) => Either<Error, T>
}
