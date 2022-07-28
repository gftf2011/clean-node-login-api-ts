/* eslint-disable import/first */
/* eslint-disable import/order */

/**
 * Shared
 */
import {
  ServerError,
  UnauthorizedError,
} from '../../../../../src/shared/errors';

/**
 * Infra
 */
// eslint-disable-next-line sort-imports
import { JwtTokenService } from '../../../../../src/infra/services/token';

/**
 * Driver
 */
import faker from 'faker';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('JWT Token Service', () => {
  let OLD_ENV: NodeJS.ProcessEnv;

  beforeAll(() => {
    process.env.JWT_SECRET = faker.datatype.uuid();
    process.env.JWT_ALGORITHM = faker.lorem.word();

    OLD_ENV = process.env;
  });

  beforeEach(() => {
    /**
     * Most important - it clears the cache
     */
    jest.resetModules();
    /**
     * Make a copy
     */
    process.env = { ...OLD_ENV };
  });

  describe('sign method', () => {
    it('should return server error if JWT_SECRET is empty', async () => {
      process.env.JWT_SECRET = '';

      const tokenServiceSignSpy = jest.spyOn(jwt, 'sign');
      const tokenService = new JwtTokenService();
      const response = await tokenService.sign(
        { id: 1 },
        { subject: 'subject', jwtId: '1', issuer: 'issuer' },
        100,
      );
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(new ServerError());
      expect(tokenServiceSignSpy).toBeCalledTimes(0);
    });

    it('should return server error if JWT_ALGORITHM is empty', async () => {
      process.env.JWT_ALGORITHM = '';

      const tokenServiceSignSpy = jest.spyOn(jwt, 'sign');
      const tokenService = new JwtTokenService();
      const response = await tokenService.sign(
        { id: 1 },
        { subject: 'subject', jwtId: '1', issuer: 'issuer' },
        100,
      );
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(new ServerError());
      expect(tokenServiceSignSpy).toBeCalledTimes(0);
    });

    it('should return json web token with correct parameters', async () => {
      const fakeToken = faker.datatype.uuid();

      const tokenServiceSignSpy = jest
        .spyOn(jwt, 'sign')
        .mockImplementationOnce(() => fakeToken);

      const tokenService = new JwtTokenService();

      const response = await tokenService.sign(
        { id: 1 },
        { subject: 'subject', jwtId: '1', issuer: 'issuer' },
        100,
      );
      expect(response.isRight()).toBeTruthy();
      expect(response.value).toEqual(fakeToken);

      expect(tokenServiceSignSpy).toBeCalledWith(
        { data: { id: 1 } },
        process.env.JWT_SECRET,
        {
          expiresIn: 100,
          header: {
            typ: 'JWT',
            alg: process.env.JWT_ALGORITHM,
          },
          subject: 'subject',
          issuer: 'issuer',
          jwtid: '1',
        },
      );

      expect(tokenServiceSignSpy).toBeCalledTimes(1);
    });
  });

  describe('verify method', () => {
    it('should return server error if JWT_SECRET is empty', async () => {
      process.env.JWT_SECRET = '';

      const fakeToken = faker.datatype.uuid();

      const tokenServiceVerifySpy = jest.spyOn(jwt, 'verify');
      const tokenService = new JwtTokenService();
      const response = await tokenService.verify(fakeToken, {
        subject: 'subject',
        jwtId: '1',
        issuer: 'issuer',
      });
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(new ServerError());
      expect(tokenServiceVerifySpy).toBeCalledTimes(0);
    });

    it('should return server error if JWT_ALGORITHM is empty', async () => {
      process.env.JWT_ALGORITHM = '';

      const fakeToken = faker.datatype.uuid();

      const tokenServiceVerifySpy = jest.spyOn(jwt, 'verify');
      const tokenService = new JwtTokenService();
      const response = await tokenService.verify(fakeToken, {
        subject: 'subject',
        jwtId: '1',
        issuer: 'issuer',
      });
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(new ServerError());
      expect(tokenServiceVerifySpy).toBeCalledTimes(0);
    });

    it('should return payload with correct parameters', async () => {
      const fakeToken = faker.datatype.uuid();
      const customPayload = { data: { id: '1' } };

      const tokenServiceVerifySpy = jest
        .spyOn(jwt, 'verify')
        .mockImplementationOnce(() => customPayload);

      const tokenService = new JwtTokenService();

      const response = await tokenService.verify(fakeToken, {
        subject: 'subject',
        jwtId: '1',
        issuer: 'issuer',
      });
      expect(response.isRight()).toBeTruthy();
      expect(response.value).toEqual(customPayload);

      expect(tokenServiceVerifySpy).toBeCalledWith(
        fakeToken,
        process.env.JWT_SECRET,
        {
          algorithms: [process.env.JWT_ALGORITHM],
          subject: 'subject',
          issuer: 'issuer',
          jwtid: '1',
        },
      );

      expect(tokenServiceVerifySpy).toBeCalledTimes(1);
    });
  });

  afterAll(() => {
    /**
     * Restore old environment
     */
    process.env = {};
  });
});
