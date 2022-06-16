/**
 * Use Cases
 */
import { IEncryptService } from '../../../use-cases/ports'

/**
 * Driver
 */
import crypto from 'crypto'

const CIPHER: string = 'aes-256-cbc'
const ENCRYPT_KEY = process.env.CODE_ENCRYPT_KEY
const ENCRYPT_IV = Buffer.from(process.env.CODE_ENCRYPT_IV, 'hex')

export class CryptoEncryptService implements IEncryptService {
  encode (secret: string): string {
    const cipher = crypto.createCipheriv(CIPHER, ENCRYPT_KEY, ENCRYPT_IV)
    cipher.update(secret, 'utf-8')
    return cipher.final().toString('hex')
  }

  decode (encrypt: string): string {
    const decipher = crypto.createDecipheriv(CIPHER, ENCRYPT_KEY, ENCRYPT_IV)
    decipher.update(encrypt, 'hex')
    return decipher.final().toString('utf-8')
  }
}
