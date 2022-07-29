/* eslint-disable import/first */
/* eslint-disable import/order */

/**
 * Infra
 */
// eslint-disable-next-line sort-imports
import { CryptoHashService } from '../../../../../src/infra/services/hash';

/**
 * Driver
 */
import crypto from 'crypto';
import faker from 'faker';

jest.mock('crypto');

describe('Crypto Hash Service', () => {
  beforeEach(() => {
    /**
     * Most important - it clears the cache
     */
    jest.clearAllMocks();
  });

  describe('encode method', () => {
    it('should return encoded value', () => {
      const password = faker.internet.password();
      const salt = faker.lorem.word();

      const buffedValue = Buffer.from(password);

      const cryptoHashService = new CryptoHashService();

      const cryptoPbkdf2SyncSpy = jest
        .spyOn(crypto, 'pbkdf2Sync')
        .mockImplementationOnce(() => buffedValue);

      const response = cryptoHashService.encode(password, salt);

      expect(cryptoPbkdf2SyncSpy).toHaveBeenCalledTimes(1);
      expect(cryptoPbkdf2SyncSpy).toHaveBeenCalledWith(
        password,
        salt,
        50000,
        128,
        'sha512',
      );

      expect(response).toBe(buffedValue.toString('hex'));
    });
  });

  describe('compare method', () => {
    it('should return true if password and hash are the same', () => {
      const password = faker.internet.password();
      const passwordHashed = Buffer.from(password).toString('hex');

      const salt = faker.lorem.word();

      const buffedValue = Buffer.from(password);

      const cryptoHashService = new CryptoHashService();

      const cryptoPbkdf2SyncSpy = jest
        .spyOn(crypto, 'pbkdf2Sync')
        .mockImplementationOnce(() => buffedValue);

      const response = cryptoHashService.compare(
        password,
        salt,
        passwordHashed,
      );

      expect(cryptoPbkdf2SyncSpy).toHaveBeenCalledTimes(1);
      expect(cryptoPbkdf2SyncSpy).toHaveBeenCalledWith(
        password,
        salt,
        50000,
        128,
        'sha512',
      );

      expect(response).toBeTruthy();
    });

    it('should return false if password and hash are not the same', () => {
      const password = faker.internet.password();
      const passwordHashed = Buffer.from(`fake_${password}`).toString('hex');

      const salt = faker.lorem.word();

      const buffedValue = Buffer.from(password);

      const cryptoHashService = new CryptoHashService();

      const cryptoPbkdf2SyncSpy = jest
        .spyOn(crypto, 'pbkdf2Sync')
        .mockImplementationOnce(() => buffedValue);

      const response = cryptoHashService.compare(
        password,
        salt,
        passwordHashed,
      );

      expect(cryptoPbkdf2SyncSpy).toHaveBeenCalledTimes(1);
      expect(cryptoPbkdf2SyncSpy).toHaveBeenCalledWith(
        password,
        salt,
        50000,
        128,
        'sha512',
      );

      expect(response).toBeFalsy();
    });
  });
});
