/**
 * Driver
 */
import faker from 'faker';

/**
 * Shared
 */
// eslint-disable-next-line sort-imports
import { Error400, InvalidPasswordError } from '../../../../src/shared/errors';

describe('Invalid Password Error', () => {
  let sut: InvalidPasswordError;
  let password: string;

  beforeEach(() => {
    password = faker.internet.password();
    sut = new InvalidPasswordError(password);
  });

  it('should extend Error400', () => {
    expect(sut).toBeInstanceOf(Error400);
  });

  it('should return error message', () => {
    expect(sut.message).toBe(
      `The password '${password}' is too weak OR too extense`,
    );
  });

  it('should return error name', () => {
    expect(sut.name).toBe('InvalidPasswordError');
  });
});
