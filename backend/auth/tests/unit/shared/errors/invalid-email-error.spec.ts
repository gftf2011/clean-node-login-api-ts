/**
 * Driver
 */
import faker from 'faker';

/**
 * Shared
 */
// eslint-disable-next-line sort-imports
import { Error400, InvalidEmailError } from '../../../../src/shared/errors';

describe('Invalid Email Error', () => {
  let sut: InvalidEmailError;
  let email: string;

  beforeEach(() => {
    email = faker.internet.email();
    sut = new InvalidEmailError(email);
  });

  it('should extend Error400', () => {
    expect(sut).toBeInstanceOf(Error400);
  });

  it('should return error message', () => {
    expect(sut.message).toBe(`The email '${email}' is not valid`);
  });

  it('should return error name', () => {
    expect(sut.name).toBe('InvalidEmailError');
  });
});
