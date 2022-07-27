/* eslint-disable import/first */
/* eslint-disable import/order */
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

  it('', () => {
    // const tokenServiceSignSpy = jest
    //   .spyOn(jwt, 'sign')
    //   .mockImplementationOnce(() => {
    //     return 'any_token';
    //   });
    // const tokenService = new JwtTokenService();
    // tokenService.sign(
    //   { id: 1 },
    //   { subject: 'subject', jwtId: '1', issuer: 'issuer' },
    //   100,
    // );
    // expect(tokenServiceSignSpy).toBeCalledTimes(1);
  });

  afterAll(() => {
    /**
     * Restore old environment
     */
    process.env = {};
  });
});
