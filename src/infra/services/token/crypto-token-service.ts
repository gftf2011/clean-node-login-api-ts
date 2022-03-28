import crypto from 'crypto'
import { ITokenService } from '@/infra/contracts'

const CRYPTOGRAPHY_TYPE: string = 'sha512'
const HASH_SIZE: number = 128
const ENCODED_PASSWORD_SIZE: number = 128
const ENCODED_ITERATIONS = 10000

export class CryptoTokenService implements ITokenService {
  hash (): string {
    return crypto.randomBytes(HASH_SIZE).toString('hex')
  }

  encode (password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, ENCODED_ITERATIONS, ENCODED_PASSWORD_SIZE, CRYPTOGRAPHY_TYPE).toString('hex')
  }

  compare (password: string, salt: string, hashedPassword: string): boolean {
    const genaratedPassword = crypto.pbkdf2Sync(password, salt, ENCODED_ITERATIONS, ENCODED_PASSWORD_SIZE, CRYPTOGRAPHY_TYPE).toString('hex')
    return genaratedPassword === hashedPassword
  }
}
