/**
 * Driver
 */
import crypto from 'crypto';

/**
 * Use Cases
 */
// eslint-disable-next-line sort-imports
import { IHashService } from '../../../use-cases/ports';

const CIPHER = 'sha512';
const ENCODED_PASSWORD_SIZE = 128;
const ENCODED_ITERATIONS = 50000;

export class CryptoHashService implements IHashService {
  private generateHash(password: string, salt: string): string {
    return crypto
      .pbkdf2Sync(
        password,
        salt,
        ENCODED_ITERATIONS,
        ENCODED_PASSWORD_SIZE,
        CIPHER,
      )
      .toString('hex');
  }

  encode(password: string, salt: string): string {
    return this.generateHash(password, salt);
  }

  compare(password: string, salt: string, hashedPassword: string): boolean {
    const genaratedPassword = this.generateHash(password, salt);
    return genaratedPassword === hashedPassword;
  }
}
