import crypto from 'crypto'

/**
 * Use Cases
 */
import { ITokenService, SaltType } from '@/use-cases/ports'

/**
 * Shared
 */
import { Either, right, left } from '@/shared'
import { ServerError } from '@/shared/errors'

const CRYPTOGRAPHY_TYPE: string = 'sha512'
const HASH_SIZE: number = 256
const ENCODED_PASSWORD_SIZE: number = 256
const ENCODED_ITERATIONS = 50000

export class CryptoTokenService implements ITokenService {
  private generateToken (password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, ENCODED_ITERATIONS, ENCODED_PASSWORD_SIZE, CRYPTOGRAPHY_TYPE).toString('hex')
  }

  salt (type: SaltType): Either<Error, string> {
    switch (type) {
      case SaltType.CUSTOM:
        if (!process.env.CODE_SALT_HASH) {
          return left(new ServerError())
        }
        return right(process.env.CODE_SALT_HASH)
      default:
        return right(crypto.randomBytes(HASH_SIZE).toString('hex'))
    }
  }

  encode (password: string, salt: string): string {
    return this.generateToken(password, salt)
  }

  compare (password: string, salt: string, hashedPassword: string): boolean {
    const genaratedPassword = this.generateToken(password, salt)
    return genaratedPassword === hashedPassword
  }
}
