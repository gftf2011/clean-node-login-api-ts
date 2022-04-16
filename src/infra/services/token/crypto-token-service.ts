import crypto from 'crypto'

/**
 * Use Cases
 */
import { ITokenService } from '@/use-cases/ports'

const CIPHER: string = 'sha512'
const ENCODED_PASSWORD_SIZE: number = 256
const ENCODED_ITERATIONS = 50000

export class CryptoTokenService implements ITokenService {
  private generateToken (password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, ENCODED_ITERATIONS, ENCODED_PASSWORD_SIZE, CIPHER).toString('hex')
  }

  encode (password: string, salt: string): string {
    return this.generateToken(password, salt)
  }

  compare (password: string, salt: string, hashedPassword: string): boolean {
    const genaratedPassword = this.generateToken(password, salt)
    return genaratedPassword === hashedPassword
  }
}
